// Ligação ao Supabase. Esta chave "anon" é pública por natureza:
// o acesso às histórias e fotografias é controlado pelas regras (RLS) no Supabase.
window.CONFIG = {
  SUPABASE_URL: "https://tgpqzxhttbpazivhtatx.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncHF6eGh0dGJwYXppdmh0YXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyMDkzMjksImV4cCI6MjExMDc4NTMyOX0.o5e4pOdNX2-AyOxPZr7WdoDyHU40C0GFPa22xDVOSk0",
  BUCKET: "fotos"
};
