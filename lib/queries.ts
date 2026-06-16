import { eq, desc } from 'drizzle-orm'
import { db } from './db'
import { horaires, evenements, tarifs, saisons, competitions, matchs, articles } from './schema'
import type { Horaire, Evenement, Resultats, Tarifs, Article } from './types'

export async function getHoraires(): Promise<Horaire[]> {
  return db.select().from(horaires)
}

export async function getEvenements(): Promise<Evenement[]> {
  const rows = await db.select().from(evenements)
  return rows.map((r) => ({
    id: r.id,
    titre: r.titre,
    date: r.date,
    heure: r.heure,
    type: r.type as Evenement['type'],
    description: r.description,
    lieu: r.lieu,
    tarif: r.tarif ?? null,
    lienInscription: r.lien_inscription ?? null,
    affiche: r.affiche ?? null,
  }))
}

export async function getTarifs(): Promise<Tarifs | null> {
  const rows = await db.select().from(tarifs).where(eq(tarifs.id, 1))
  if (!rows[0]) return null
  return {
    saison: rows[0].saison,
    cotisation_adulte: rows[0].cotisation_adulte,
    cotisation_enfant: rows[0].cotisation_enfant,
    licence_ffe_incluse: rows[0].licence_ffe_incluse,
    note: rows[0].note,
  }
}

export async function getArticles(onlyPublished = true): Promise<Article[]> {
  const rows = onlyPublished
    ? await db.select().from(articles).where(eq(articles.publie, true)).orderBy(desc(articles.date))
    : await db.select().from(articles).orderBy(desc(articles.date))
  return rows.map((r) => ({
    slug: r.slug,
    titre: r.titre,
    date: r.date,
    resume: r.resume,
    image_couverture: r.image_couverture ?? null,
  }))
}

export async function getArticle(slug: string): Promise<(Article & { contenu: string; id: number; publie: boolean }) | null> {
  const rows = await db.select().from(articles).where(eq(articles.slug, slug))
  if (!rows[0]) return null
  return {
    id: rows[0].id,
    slug: rows[0].slug,
    titre: rows[0].titre,
    date: rows[0].date,
    resume: rows[0].resume,
    image_couverture: rows[0].image_couverture ?? null,
    contenu: rows[0].contenu,
    publie: rows[0].publie,
  }
}

export async function getArticleById(id: number) {
  const rows = await db.select().from(articles).where(eq(articles.id, id))
  return rows[0] ?? null
}

export async function getEvenementById(id: string) {
  const rows = await db.select().from(evenements).where(eq(evenements.id, id))
  return rows[0] ?? null
}

export async function getHoraireById(id: string) {
  const rows = await db.select().from(horaires).where(eq(horaires.id, id))
  return rows[0] ?? null
}

export async function getResultats(): Promise<Resultats | null> {
  const saisonRows = await db.select().from(saisons).limit(1)
  if (!saisonRows[0]) return null

  const saisonRow = saisonRows[0]
  const competRows = await db
    .select()
    .from(competitions)
    .where(eq(competitions.saison_id, saisonRow.id))

  const competitionsWithMatchs = await Promise.all(
    competRows.map(async (comp) => {
      const matchRows = await db
        .select()
        .from(matchs)
        .where(eq(matchs.competition_id, comp.id))
      return {
        nom: comp.nom,
        equipe: comp.equipe,
        classement: comp.classement ?? null,
        matchs: matchRows.map((m) => ({
          adversaire: m.adversaire,
          domicile: m.domicile,
          score_nous: m.score_nous,
          score_eux: m.score_eux,
          resultat: m.resultat as 'victoire' | 'nul' | 'defaite',
        })),
      }
    })
  )

  return {
    saison: saisonRow.saison,
    competitions: competitionsWithMatchs,
  }
}
