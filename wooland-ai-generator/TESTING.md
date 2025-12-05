# Przewodnik testowania WooLanding AI Generator

## 🎉 Status: GOTOWE DO TESTOWANIA

Wtyczka jest w pełni funkcjonalna i gotowa do użycia!

## Instalacja i Aktywacja

### Krok 1: Upload wtyczki
```bash
# Skopiuj cały folder do WordPress
cp -r wooland-ai-generator /ścieżka/do/wordpress/wp-content/plugins/
```

### Krok 2: Aktywacja
1. Zaloguj się do WordPress Admin
2. Przejdź do **Wtyczki > Zainstalowane wtyczki**
3. Znajdź "WooLanding AI Generator"
4. Kliknij **Aktywuj**

### Krok 3: Konfiguracja (opcjonalnie)
1. Przejdź do **WooCommerce > AI Landing Generator**
2. Wprowadź klucz API (na razie nieużywany, dla przyszłej integracji)
3. Kliknij **Zapisz zmiany**

## Testowanie funkcjonalności

### Test 1: Generowanie podstawowej landing page

**Przygotowanie:**
1. Upewnij się, że masz przynajmniej jeden produkt WooCommerce
2. Produkt powinien mieć:
   - Nazwę
   - Cenę
   - Zdjęcie (opcjonalnie)
   - Opis (opcjonalnie)

**Wykonanie:**
1. Przejdź do **Produkty > Wszystkie produkty**
2. Kliknij "Edytuj" na dowolnym produkcie
3. W prawym panelu bocznym znajdź metabox **"AI Landing Generator"**
4. Kliknij przycisk **"Generate Landing Page"**
5. Poczekaj 2-3 sekundy

**Oczekiwany rezultat:**
- ✅ Komunikat sukcesu: "Success! Edit Landing Page"
- ✅ Link do edycji nowej strony
- ✅ Strona automatycznie się przeładowuje
- ✅ W metaboxie pojawia się informacja o utworzonej stronie

### Test 2: Sprawdzenie wygenerowanej strony

**Wykonanie:**
1. Kliknij link "Edit Landing Page" z poprzedniego testu
2. Sprawdź edytor WordPress

**Oczekiwany rezultat:**
Strona powinna zawierać:
- ✅ Tytuł: "Landing Page for [Nazwa produktu]"
- ✅ Status: **Wersja robocza**
- ✅ Kompletny layout z sekcjami:
  - Hero section (nagłówek, cena, przycisk CTA)
  - Zdjęcie produktu (jeśli dostępne)
  - Sekcja korzyści (3 punkty)
  - Szczegóły produktu
  - Testimonial (opinia klienta)
  - Finalne CTA

### Test 3: Regenerowanie landing page

**Wykonanie:**
1. Wróć do edycji produktu
2. Kliknij ponownie "Generate Landing Page"
3. Potwierdź w dialogu: "A landing page already exists..."

**Oczekiwany rezultat:**
- ✅ Pojawia się dialog potwierdzenia
- ✅ Po potwierdzeniu generowana jest nowa strona
- ✅ Stara strona nadal istnieje (nowa nadpisuje link w meta)

### Test 4: Testowanie różnych produktów

**Wykonanie:**
Wygeneruj landing page dla produktów z różnymi cechami:
1. Produkt z przeceną (sale price)
2. Produkt bez zdjęcia
3. Produkt z długim opisem
4. Produkt z krótkiej kategorii

**Oczekiwany rezultat:**
- ✅ Dla produktów z przeceną: Widoczna poprzednia cena przekreślona + badge "SALE!"
- ✅ Dla produktów bez zdjęcia: Layout bez obrazu, ale reszta działa
- ✅ Opis jest skracany do 300 znaków jeśli za długi
- ✅ Różne warianty nagłówków i CTA dla każdego produktu

### Test 5: Bezpieczeństwo i uprawnienia

**Wykonanie:**
1. Wyloguj się z konta administratora
2. Zaloguj się jako użytkownik bez uprawnień do edycji produktów
3. Spróbuj wywołać AJAX bezpośrednio (przez console)

**Oczekiwany rezultat:**
- ✅ Przycisk nie jest widoczny dla użytkowników bez uprawnień
- ✅ AJAX zwraca błąd uprawnień

## Sprawdzanie danych w bazie

### Post Meta - Produkt
```sql
SELECT * FROM wp_postmeta
WHERE meta_key = '_wlag_landing_page_id'
AND post_id = [ID_PRODUKTU];
```

**Oczekiwany rezultat:**
- Powinien zwrócić ID wygenerowanej strony

### Post Meta - Landing Page
```sql
SELECT * FROM wp_postmeta
WHERE meta_key = '_wlag_parent_product_id'
AND meta_value = [ID_PRODUKTU];
```

**Oczekiwany rezultat:**
- Powinien zwrócić powiązanie strony z produktem

## Testy jakości kodu

### Test 1: Błędy PHP
```bash
# Włącz debug mode w wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

# Sprawdź logi
tail -f wp-content/debug.log
```

**Oczekiwany rezultat:**
- ✅ Brak błędów PHP
- ✅ Brak ostrzeżeń (warnings)

### Test 2: JavaScript Console
```
Otwórz DevTools > Console podczas generowania
```

**Oczekiwany rezultat:**
- ✅ Brak błędów JavaScript
- ✅ AJAX request zakończony sukcesem (status 200)

### Test 3: Network Performance
```
DevTools > Network > Sprawdź request "admin-ajax.php"
```

**Oczekiwany rezultat:**
- ✅ Czas odpowiedzi < 3 sekundy
- ✅ Response type: application/json
- ✅ Response zawiera edit_url i page_id

## Testowanie edge cases

### Edge Case 1: Produkt bez ceny
**Rezultat:** Landing page powinna zostać utworzona z pustym polem ceny

### Edge Case 2: Bardzo długa nazwa produktu
**Rezultat:** Tytuł strony powinien zostać prawidłowo zapisany

### Edge Case 3: Produkt bez kategorii
**Rezultat:** Mock AI używa domyślnej wartości "product"

### Edge Case 4: Produkt niedostępny (out of stock)
**Rezultat:** Landing page jest tworzona, ale `is_in_stock` = false

## Typowe problemy i rozwiązania

### Problem: "Product not found"
**Rozwiązanie:**
- Sprawdź czy WooCommerce jest aktywne
- Sprawdź czy produkt naprawdę istnieje
- Sprawdź ID produktu w przeglądarce

### Problem: "Template file not found"
**Rozwiązanie:**
- Sprawdź czy plik `templates/landing-page-template.html` istnieje
- Sprawdź uprawnienia plików (644)

### Problem: Strona jest pusta
**Rozwiązanie:**
- Sprawdź czy template zawiera placeholdery
- Włącz WP_DEBUG i sprawdź logi
- Sprawdź czy proces_template() nie zwraca pustego stringa

### Problem: AJAX timeout
**Rozwiązanie:**
- Zwiększ timeout w PHP (max_execution_time)
- Sprawdź logi serwera
- Zredukuj rozmiar obrazów produktu

## Checklist do akceptacji

Przed uznaniem wtyczki za działającą sprawdź:

- [ ] Wtyczka aktywuje się bez błędów
- [ ] Strona ustawień jest dostępna w menu WooCommerce
- [ ] Metabox pojawia się na stronie edycji produktu
- [ ] Przycisk "Generate Landing Page" jest klikalny
- [ ] AJAX zwraca sukces po kliknięciu
- [ ] Nowa strona jest tworzona jako wersja robocza
- [ ] Strona zawiera wszystkie sekcje z szablonu
- [ ] Dane produktu są prawidłowo wstawione
- [ ] Link "Edit Landing Page" prowadzi do właściwej strony
- [ ] Regenerowanie działa poprawnie
- [ ] Brak błędów PHP w logach
- [ ] Brak błędów JavaScript w console
- [ ] Meta linking produkt-strona działa
- [ ] Bezpieczeństwo: nonce verification działa
- [ ] Bezpieczeństwo: capability checks działają

## Raportowanie błędów

Jeśli znajdziesz błąd, zgłoś go z następującymi informacjami:

1. **Krok po kroku do reprodukcji**
2. **Oczekiwany rezultat**
3. **Faktyczny rezultat**
4. **Wersja WordPress**
5. **Wersja WooCommerce**
6. **Wersja PHP**
7. **Logi z wp-content/debug.log**
8. **Screenshot błędu**

## Następne kroki po testach

Po pomyślnym przetestowaniu możesz:

1. **Dostosować szablon** w `templates/landing-page-template.html`
2. **Zmodyfikować logikę AI** w `mock_ai_response()`
3. **Dodać własne style CSS** w `assets/css/admin.css`
4. **Zintegrować prawdziwe API AI** (zastąp mock_ai_response)
5. **Dodać nowe szablony** (multi-template support)

## Kontakt

W razie pytań lub problemów:
- GitHub Issues: https://github.com/adriandev-web/saaswp/issues
- Email: [twój email]

---

**Powodzenia w testowaniu!** 🚀
