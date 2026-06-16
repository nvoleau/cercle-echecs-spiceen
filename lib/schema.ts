import { pgTable, text, boolean, integer, serial } from 'drizzle-orm/pg-core'

export const horaires = pgTable('horaires', {
  id: text('id').primaryKey(),
  jour: text('jour').notNull(),
  heure_debut: text('heure_debut').notNull(),
  heure_fin: text('heure_fin').notNull(),
  libelle: text('libelle').notNull().default(''),
  lieu: text('lieu').notNull(),
})

export const evenements = pgTable('evenements', {
  id: text('id').primaryKey(),
  titre: text('titre').notNull(),
  date: text('date').notNull(),
  heure: text('heure').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  lieu: text('lieu').notNull(),
  tarif: text('tarif'),
  lien_inscription: text('lien_inscription'),
  affiche: text('affiche'),
})

export const tarifs = pgTable('tarifs', {
  id: integer('id').primaryKey(),
  saison: text('saison').notNull(),
  cotisation_adulte: text('cotisation_adulte').notNull().default('—'),
  cotisation_enfant: text('cotisation_enfant').notNull().default('—'),
  licence_ffe_incluse: boolean('licence_ffe_incluse').notNull().default(true),
  note: text('note').notNull().default(''),
})

export const saisons = pgTable('saisons', {
  id: serial('id').primaryKey(),
  saison: text('saison').notNull(),
})

export const competitions = pgTable('competitions', {
  id: serial('id').primaryKey(),
  saison_id: integer('saison_id').notNull(),
  nom: text('nom').notNull(),
  equipe: text('equipe').notNull(),
  classement: integer('classement'),
})

export const matchs = pgTable('matchs', {
  id: serial('id').primaryKey(),
  competition_id: integer('competition_id').notNull(),
  adversaire: text('adversaire').notNull(),
  domicile: boolean('domicile').notNull(),
  score_nous: integer('score_nous').notNull(),
  score_eux: integer('score_eux').notNull(),
  resultat: text('resultat').notNull(),
})
