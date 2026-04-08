# Deploy ve Rollback Notları

## Standart deploy akışı
```powershell
Set-Location "C:\Users\ihsan\OneDrive\premat"
npm run build
git status
git add .
git commit -m "Mesaj"
git push
```

## Hızlı rollback mantığı
Sorunlu deploy sonrası:
1. Sorunu yapan son commit'i tespit et
2. Küçükse dosyayı eski hâline çevirip yeni commit at
3. Büyükse güvenli son commit'e dön

## Güvenli geri dönüş örneği
```powershell
git log --oneline
```

İyi çalışan commit hash'ini bulduktan sonra:
```powershell
git checkout HASH -- .
git status
git add .
git commit -m "Rollback to stable state"
git push
```

## Ne yapmamalısın
- Çalışan ortamda aynı anda çok büyük UI + altyapı değişikliği atma
- Build almadan push yapma
- Sorunu anlamadan rastgele policy değiştirme
