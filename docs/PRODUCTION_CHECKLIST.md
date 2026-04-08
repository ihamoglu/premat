# Premat Production Checklist

## Deploy öncesi
- `npm run build` hatasız geçiyor mu kontrol et.
- `git status` temiz mi kontrol et.
- `.env` tarafında `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` doğru mu kontrol et.
- Admin mail sabiti doğru mu kontrol et.
- Supabase RLS policy'leri ve Storage policy'leri son hâliyle duruyor mu kontrol et.

## Deploy sonrası 5 dakikalık kontrol
- Ana sayfa açılıyor mu
- `/documents` açılıyor mu
- Bir döküman detay sayfası açılıyor mu
- `/sinif/5` gibi sınıf sayfaları açılıyor mu
- `/panel-giris` açılıyor mu
- Admin giriş sonrası `/panel` açılıyor mu
- `/api/health` `ok: true` dönüyor mu
- `/robots.txt` ve `/sitemap.xml` açılıyor mu

## İçerik operasyon kontrolü
- Yeni kayıt ekleme çalışıyor mu
- Görsel yükleme çalışıyor mu
- Görsel önizleme çalışıyor mu
- Kayıt güncelleme sonrası public tarafta değişiklik yansıyor mu
- Kayıt silme sonrası storage tarafında eski kapak görseli temizleniyor mu
- Orphan cleanup taraması sonuç veriyor mu

## Güvenlik kontrolü
- Çıkış yapmış kullanıcı taslakları göremiyor mu
- Admin olmayan kullanıcı paneli açamıyor mu
- Admin olmayan kullanıcı storage yükleme yapamıyor mu

## Son not
Bu liste deploy sonrası hızlı doğrulama içindir. Sorun çıkarsa önce son commit'i ve son değiştirilen dosyayı daralt.
