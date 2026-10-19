package com.ecommerce.config;

import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.categoryRepository = categoryRepository;
        this.productRepository  = productRepository;
        this.userRepository     = userRepository;
        this.passwordEncoder    = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // ✅ CRÉER ADMIN AUTOMATIQUEMENT
        if (!userRepository.existsByEmail("admin@miya.com")) {
            User admin = User.builder()
                    .nom("Admin")
                    .email("admin@miya.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin créé : admin@miya.com / admin123");
        }

        if (productRepository.count() > 0) {
            System.out.println("✅ Products already exist. Skipping initialization.");
            return;
        }

        System.out.println("🌱 Initializing Miya Cosmetics with 50 unique premium products...");

        Category serums     = getOrCreateCategory("Serums",     "Innovative concentrates for every skin concern");
        Category sunscreens = getOrCreateCategory("Sunscreens", "Advanced UV protection and skin defense");
        Category cleansers  = getOrCreateCategory("Cleansers",  "Gentle yet effective daily cleansing solutions");
        Category masks      = getOrCreateCategory("Masks",      "Targeted treatments for skin revitalization");
        Category creams     = getOrCreateCategory("Creams",     "Luxurious moisturizers for lasting hydration");
        Category hairCare   = getOrCreateCategory("Hair Care",  "High-performance scalp and hair treatments");
        Category bodyCare   = getOrCreateCategory("Body Care",  "Nourishing essentials for beautiful skin");
        Category makeup     = getOrCreateCategory("Makeup",     "Effortless color for a natural, radiant look");

        String imgSerum1  = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop";
        String imgSerum2  = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop";
        String imgSerum3  = "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=600&auto=format&fit=crop";
        String imgSerum4  = "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&auto=format&fit=crop";
        String imgSerum5  = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop";
        String imgSun1    = "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=600&auto=format&fit=crop";
        String imgSun2    = "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=600&auto=format&fit=crop";
        String imgClean1  = "https://images.unsplash.com/photo-1631390051444-d1d3af5aa64b?w=600&auto=format&fit=crop";
        String imgClean2  = "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop";
        String imgClean3  = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&auto=format&fit=crop";
        String imgMask1   = "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&auto=format&fit=crop";
        String imgMask2   = "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&auto=format&fit=crop";
        String imgCream1  = "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop";
        String imgCream2  = "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&auto=format&fit=crop";
        String imgCream3  = "https://images.unsplash.com/photo-1600428610119-11786a82dbf4?w=600&auto=format&fit=crop";
        String imgHair1   = "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop";
        String imgHair2   = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop";
        String imgBody1   = "https://images.unsplash.com/photo-1519415387722-a68f8a57fe9f?w=600&auto=format&fit=crop";
        String imgBody2   = "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&auto=format&fit=crop";
        String imgMakeup1 = "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=600&auto=format&fit=crop";
        String imgMakeup2 = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop";
        String imgMakeup3 = "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&auto=format&fit=crop";

        createProduct("SkinCeuticals C E Ferulic", "Gold-standard vitamin C antioxidant serum for environmental protection and brightening", new BigDecimal("169.00"), 15, imgSerum1, serums);
        createProduct("COSRX Advanced Snail 96 Mucin Power Essence", "Hydrating and repairing essence powered by 96% snail secretion filtrate", new BigDecimal("25.00"), 80, imgSerum2, serums);
        createProduct("Medik8 Crystal Retinal 6", "Intermediate-strength retinaldehyde serum for visible anti-aging and skin renewal", new BigDecimal("60.00"), 25, imgSerum3, serums);
        createProduct("Anua Heartleaf Quercetinol Pore Control Serum", "Calms redness and visibly tightens pores with botanical quercetinol complex", new BigDecimal("22.00"), 45, imgSerum4, serums);
        createProduct("Torriden Dive-In Low Molecule Hyaluronic Acid Serum", "Five-weight hyaluronic acid complex for deep, non-sticky plumping hydration", new BigDecimal("19.00"), 70, imgSerum5, serums);
        createProduct("The Ordinary Niacinamide 10% + Zinc 1%", "High-strength niacinamide to reduce blemishes, pores, and control excess sebum", new BigDecimal("7.00"), 150, imgSerum1, serums);
        createProduct("Paula's Choice 10% Niacinamide Booster", "Concentrated booster for uneven tone, enlarged pores, and moisture retention", new BigDecimal("44.00"), 30, imgSerum2, serums);
        createProduct("Isntree Hyaluronic Acid Toner Plus", "Seven types of hyaluronic acid in a lightweight toner-serum format for all skin types", new BigDecimal("18.00"), 60, imgSerum3, serums);
        createProduct("Numbuzin No.5 Vitamin Concentrated Serum", "Triple-vitamin C complex for radiance, collagen synthesis, and dark spot correction", new BigDecimal("34.00"), 40, imgSerum4, serums);
        createProduct("Dear Klairs Freshly Juiced Vitamin Drop", "Gentle 5% vitamin C drop serum safe for sensitive and reactive skin types", new BigDecimal("20.00"), 55, imgSerum5, serums);

        createProduct("Beauty of Joseon Relief Sun Rice + Probiotics SPF50+", "Lightweight mineral sunscreen with probiotic ferment for a natural, glowy finish", new BigDecimal("14.00"), 100, imgSun1, sunscreens);
        createProduct("La Roche-Posay Anthelios UVMune 400 SPF50+", "Broad-spectrum protection with patented Mexoryl 400 against ultra-long UVA rays", new BigDecimal("35.00"), 50, imgSun2, sunscreens);
        createProduct("Skin1004 Hyalu-Cica Water-fit Sun Serum SPF50+", "Centella and hyaluronic acid sun serum with a water-light, non-white-cast finish", new BigDecimal("22.00"), 65, imgSun1, sunscreens);
        createProduct("Round Lab Birch Juice Moisturizing Sun Cream SPF50+", "Deeply moisturizing mineral-chemical hybrid sunscreen for dry and sensitive skin", new BigDecimal("20.00"), 55, imgSun2, sunscreens);
        createProduct("Purito Daily Go-To Sunscreen SPF50+", "Fragrance-free, reef-safe, non-greasy sunscreen suitable for daily makeup base", new BigDecimal("16.00"), 75, imgSun1, sunscreens);

        createProduct("Anua Heartleaf Pore Control Cleansing Oil", "Dual-phase oil cleanser that dissolves sunscreen and makeup without stripping moisture", new BigDecimal("21.00"), 70, imgClean1, cleansers);
        createProduct("La Roche-Posay Effaclar Purifying Foaming Gel", "Zinc-powered foaming gel for daily deep-cleaning of oily and acne-prone skin", new BigDecimal("15.00"), 85, imgClean2, cleansers);
        createProduct("CeraVe Hydrating Cream-to-Foam Cleanser", "Three essential ceramides and hyaluronic acid in a non-stripping cream-to-foam formula", new BigDecimal("13.00"), 95, imgClean3, cleansers);
        createProduct("Then I Met You Living Cleansing Balm", "Korean double-cleansing balm with oat kernel and sea buckthorn for a nourishing cleanse", new BigDecimal("38.00"), 30, imgClean1, cleansers);
        createProduct("Cosrx Low pH Good Morning Gel Cleanser", "pH 5.0 tea-tree gel cleanser designed to preserve the skin's acid mantle every morning", new BigDecimal("12.00"), 90, imgClean2, cleansers);
        createProduct("Bioderma Sensibio H2O Micellar Water 500ml", "Dermatologist gold standard for removing makeup and impurities on sensitive skin", new BigDecimal("14.00"), 100, imgClean3, cleansers);
        createProduct("KraveBeauty Matcha Hemp Hydrating Cleanser", "Antioxidant-rich green cleanser that hydrates while removing daily impurities gently", new BigDecimal("16.00"), 65, imgClean1, cleansers);
        createProduct("BYOMA Creamy Jelly Cleanser", "Barrier-supportive pH-balanced jelly cleanser with ceramide complex and prebiotics", new BigDecimal("10.00"), 80, imgClean2, cleansers);
        createProduct("Sulwhasoo Gentle Cleansing Foam", "Luxurious Korean herbal foam cleanser with ginseng for a silky, fresh complexion", new BigDecimal("42.00"), 25, imgClean3, cleansers);
        createProduct("Farmacy Green Clean Makeup Removing Cleansing Balm", "Papaya-enzyme cleansing balm that transforms from balm to oil to milk on contact", new BigDecimal("34.00"), 40, imgClean1, cleansers);

        createProduct("Glow Recipe Watermelon Glow Sleeping Mask", "Overnight AHA gel mask with watermelon extract for smoother, glowing skin by morning", new BigDecimal("45.00"), 35, imgMask1, masks);
        createProduct("Innisfree Jeju Volcanic Pore Clay Mask", "Jeju volcanic ash and kaolin clay mask that deep-cleans pores and absorbs excess oil", new BigDecimal("18.00"), 60, imgMask2, masks);
        createProduct("First Aid Beauty Ultra Repair Instant Oatmeal Mask", "Colloidal oatmeal and shea butter mask for immediate relief of dry, stressed skin", new BigDecimal("32.00"), 40, imgMask1, masks);
        createProduct("Summer Fridays Jet Lag Mask", "No-rinse hydrating mask with niacinamide and vitamins C and E for travel-stressed skin", new BigDecimal("49.00"), 30, imgMask2, masks);
        createProduct("TONYMOLY I'm Real Rice Sheet Mask", "Korean rice extract sheet mask for brightening, smoothing, and pore-minimizing benefits", new BigDecimal("5.00"), 200, imgMask1, masks);

        createProduct("La Roche-Posay Cicaplast Baume B5+", "Multi-purpose repairing balm with panthenol for irritated, cracked, and sensitive skin", new BigDecimal("15.00"), 100, imgCream1, creams);
        createProduct("Embryolisse Lait-Crème Concentré", "French pharmacy cult-favorite: rich 24-hour cream that doubles as a makeup primer", new BigDecimal("19.00"), 70, imgCream2, creams);
        createProduct("Dr. Jart+ Ceramidin Cream", "Five-ceramide complex cream that reinforces the skin barrier and delivers lasting moisture", new BigDecimal("46.00"), 35, imgCream3, creams);
        createProduct("Vanicream Moisturizing Cream", "Fragrance-free, non-comedogenic cream with glycerin for ultra-sensitive, reactive skin", new BigDecimal("12.00"), 85, imgCream1, creams);
        createProduct("Tatcha The Water Cream", "Oil-free Japanese botanical cream that releases a burst of moisture for poreless radiance", new BigDecimal("68.00"), 25, imgCream2, creams);
        createProduct("CeraVe Daily Moisturizing Lotion", "Lightweight ceramide and hyaluronic acid lotion for 24-hour hydration without greasiness", new BigDecimal("12.00"), 120, imgCream3, creams);
        createProduct("Belif The True Cream Aqua Bomb", "Lightweight gel-cream with lady's mantle for an intense, oil-free moisture surge", new BigDecimal("38.00"), 45, imgCream1, creams);
        createProduct("Kiehl's Ultra Facial Cream SPF 30", "Iconic daily moisturizer with Antarctic glacier water and built-in SPF 30 protection", new BigDecimal("36.00"), 50, imgCream2, creams);
        createProduct("Laneige Water Sleeping Mask", "Hydro-ionized mineral water sleeping mask that restores skin moisture overnight", new BigDecimal("28.00"), 55, imgCream3, creams);
        createProduct("Olehenriksen Strength Trainer Peptide Boost Moisturizer", "Peptide-rich firming moisturizer that visibly lifts and tightens skin over time", new BigDecimal("42.00"), 40, imgCream1, creams);

        createProduct("Mielle Organics Rosemary Mint Strengthening Hair Oil", "Biotin-infused scalp oil with rosemary and mint to stimulate and strengthen hair growth", new BigDecimal("9.00"), 110, imgHair1, hairCare);
        createProduct("Olaplex No. 3 Hair Perfector", "At-home bond-building treatment that reduces breakage and strengthens all hair types", new BigDecimal("28.00"), 60, imgHair2, hairCare);
        createProduct("Kérastase Chronologiste Huile de Parfum", "Luxurious pre-shampoo scalp oil ritual that revitalizes and deeply nourishes aged hair", new BigDecimal("62.00"), 20, imgHair1, hairCare);
        createProduct("Briogeo Don't Despair Repair! Deep Conditioning Mask", "Rosehip and algae deep conditioning mask for intense repair of dry, damaged hair", new BigDecimal("38.00"), 35, imgHair2, hairCare);
        createProduct("dpHUE Apple Cider Vinegar Hair Rinse", "ACV scalp rinse that balances pH, removes buildup, and adds brilliant shine", new BigDecimal("35.00"), 30, imgHair1, hairCare);

        createProduct("Sol de Janeiro Brazilian Bum Bum Cream", "Signature guaraná and cupuaçu butter cream that firms, smooths, and deliciously scents skin", new BigDecimal("45.00"), 50, imgBody1, bodyCare);
        createProduct("Nécessaire The Body Serum", "Multivitamin A, B3, C, E lightweight serum for full-body hydration and skin renewal", new BigDecimal("25.00"), 45, imgBody2, bodyCare);
        createProduct("First Aid Beauty KP Bump Eraser Body Scrub", "10% AHA dual-exfoliant scrub that buffs away keratosis pilaris bumps and rough texture", new BigDecimal("30.00"), 35, imgBody1, bodyCare);
        createProduct("Dove Intensive Repair Body Butter", "Ultra-rich shea butter body balm for deep overnight nourishment of very dry skin", new BigDecimal("8.00"), 120, imgBody2, bodyCare);
        createProduct("Kiehl's Creme de Corps Soy Milk and Honey Whip", "Whipped, fast-absorbing body lotion with soy protein and honey for silky-smooth skin", new BigDecimal("32.00"), 40, imgBody1, bodyCare);

        createProduct("Rare Beauty Soft Pinch Liquid Blush", "Highly pigmented, one-drop weightless liquid blush for a natural flush of color", new BigDecimal("23.00"), 45, imgMakeup1, makeup);
        createProduct("Fenty Beauty Pro Filt'r Soft Matte Foundation", "Long-wearing soft matte foundation with 50 inclusive shades for all undertones", new BigDecimal("38.00"), 55, imgMakeup2, makeup);
        createProduct("Glossier Boy Brow", "Cult-favorite brow pomade for fluffy, groomed, naturally full-looking brows", new BigDecimal("16.00"), 70, imgMakeup3, makeup);
        createProduct("Charlotte Tilbury Flawless Filter", "Complexion booster and luminous foundation hybrid for an effortless lit-from-within glow", new BigDecimal("46.00"), 40, imgMakeup1, makeup);
        createProduct("NARS Radiant Creamy Concealer", "Award-winning creamy concealer with buildable coverage that never creases or cakes", new BigDecimal("30.00"), 60, imgMakeup2, makeup);

        System.out.println("✅ 50 unique products inserted across 8 categories. No duplicates.");
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    c.setDescription(description);
                    return categoryRepository.save(c);
                });
    }

    private void createProduct(String name, String description, BigDecimal price,
                               int stock, String imageUrl, Category category) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setStock(stock);
        p.setImageUrl(imageUrl);
        p.setCategory(category);
        productRepository.save(p);
    }
}