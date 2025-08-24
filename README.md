# Projektbeskrivning: Task Manager (Next.js 14 + Tailwind + TypeScript)

En modern Task Manager med mockad e-postinloggning, filter (Alla/Aktiva/Klara), dark mode och LocalStorage.

## Funktioner
- Mockad login (e-post + valfritt lösenord), lagras lokalt
- Lägg till, markera klara, ta bort uppgifter
- Prioritet, förfallodatum, anteckningar
- Filter: Alla / Aktiva / Klara
- Dark/Light mode
- Snygg card-baserad layout med Tailwind
- Inga externa tjänster – funkar offline

## Kör lokalt

```bash
npm install
npm run dev
# öppna http://localhost:3000
```

## Struktur enligt följande
```
app/
  layout.tsx
  page.tsx
  globals.css
components/
  TaskApp.tsx
```

## Deploy
- Pusha till GitHub.
- Deploya på **Vercel** (auto-detekterar Next.js).

## Förslag på förbättringar
- Molnlagring (Supabase/Firebase)
- Dra-och-släpp sortering
- Etiketter/taggar
- Påminnelse-notiser
