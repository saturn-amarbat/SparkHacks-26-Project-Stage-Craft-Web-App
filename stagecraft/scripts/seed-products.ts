import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { generateEmbedding, createProductEmbeddingText } from '../lib/ai/embeddings';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProductInput {
  name: string;
  description: string;
  category: 'Costume' | 'Prop' | 'Equipment';
  tags: string[];
  rental_price_per_day: number;
  purchase_price?: number;
  image_url: string;
  owner_id: string;
}

// Theatrical products data optimized for "Hamlet Protocol" demo
const products: Omit<ProductInput, 'owner_id'>[] = [
  // CRITICAL ITEMS FOR HAMLET PROTOCOL DEMO
  {
    name: '1920s Black Tuxedo',
    description: 'Authentic reproduction of a 1920s Jazz Age formal tuxedo. Black wool with satin lapels, high-waisted trousers, and period-accurate tailoring. Perfect for a modern-dress Hamlet in a Gatsby-era production.',
    category: 'Costume',
    tags: ['1920s', 'tuxedo', 'menswear', 'formal', 'black', 'jazz age', 'gatsby', 'hamlet'],
    rental_price_per_day: 45.00,
    purchase_price: 380.00,
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
  },
  {
    name: 'Replica Human Skull (Yorick)',
    description: 'Museum-quality replica human skull, anatomically accurate. The iconic prop for the graveyard scene in Hamlet. Resin construction with realistic aging and weathering.',
    category: 'Prop',
    tags: ['skull', 'yorick', 'hamlet', 'shakespeare', 'graveyard', 'prop', 'death'],
    rental_price_per_day: 15.00,
    purchase_price: 95.00,
    image_url: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800',
  },
  {
    name: 'Art Deco Cufflinks Set',
    description: 'Stunning silver-plated Art Deco cufflinks with geometric patterns. Perfect period accessories for 1920s formal wear.',
    category: 'Costume',
    tags: ['art deco', '1920s', 'accessories', 'cufflinks', 'jewelry', 'menswear'],
    rental_price_per_day: 8.00,
    purchase_price: 45.00,
    image_url: 'https://images.unsplash.com/photo-1513107779984-de4d8e99c4d5?w=800',
  },
  {
    name: 'Vintage Pocket Watch',
    description: 'Gold-plated pocket watch with chain, authentic 1920s style. Working mechanism, perfect for period productions.',
    category: 'Prop',
    tags: ['pocket watch', '1920s', 'accessory', 'prop', 'timepiece', 'vintage'],
    rental_price_per_day: 12.00,
    purchase_price: 120.00,
    image_url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800',
  },
  {
    name: 'Art Deco Cigarette Case',
    description: 'Sleek silver cigarette case with engraved geometric patterns typical of the Jazz Age. Essential prop for 1920s productions.',
    category: 'Prop',
    tags: ['cigarette case', 'art deco', '1920s', 'prop', 'silver', 'accessory'],
    rental_price_per_day: 10.00,
    purchase_price: 65.00,
    image_url: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800',
  },
  {
    name: 'Vintage Dagger with Sheath',
    description: 'Theatrical prop dagger with ornate handle and leather sheath. Safe dulled blade, perfect for stage combat in period dramas including Hamlet.',
    category: 'Prop',
    tags: ['dagger', 'weapon', 'hamlet', 'shakespeare', 'combat', 'stage weapon'],
    rental_price_per_day: 18.00,
    purchase_price: 140.00,
    image_url: 'https://images.unsplash.com/photo-1566207462892-cccf8f0b97e2?w=800',
  },

  // COSTUMES - Period and Character-Specific
  {
    name: 'Victorian Gothic Dress',
    description: 'Floor-length black Victorian gown with high collar, lace trim, and bustle. Perfect for gothic productions, mourning scenes, or Victorian-era characters.',
    category: 'Costume',
    tags: ['victorian', 'dress', 'gothic', 'mourning', 'period', 'womens'],
    rental_price_per_day: 55.00,
    purchase_price: 450.00,
    image_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
  },
  {
    name: 'Flapper Dress (Gold Sequins)',
    description: 'Dazzling gold sequined flapper dress with fringe, perfect for 1920s productions. Knee-length with drop waist, complete with headband.',
    category: 'Costume',
    tags: ['1920s', 'flapper', 'dress', 'sequins', 'jazz age', 'womens', 'gatsby'],
    rental_price_per_day: 48.00,
    purchase_price: 320.00,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
  },
  {
    name: 'Medieval Knight Armor Set',
    description: 'Full theatrical armor set including breastplate, gauntlets, greaves, and helmet. Lightweight aluminum construction safe for stage use.',
    category: 'Costume',
    tags: ['medieval', 'armor', 'knight', 'period', 'shakespeare', 'fantasy'],
    rental_price_per_day: 85.00,
    purchase_price: 850.00,
    image_url: 'https://images.unsplash.com/photo-1533660859-b649ad46bcaa?w=800',
  },
  {
    name: 'Renaissance Noble Doublet',
    description: 'Rich burgundy velvet doublet with gold trim and puffed sleeves. Suitable for Shakespeare, Renaissance faire, or Elizabethan productions.',
    category: 'Costume',
    tags: ['renaissance', 'doublet', 'shakespeare', 'elizabethan', 'noble', 'menswear'],
    rental_price_per_day: 42.00,
    purchase_price: 285.00,
    image_url: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?w=800',
  },
  {
    name: '1950s Housewife Dress',
    description: 'Vintage-style 1950s day dress with full skirt, cinched waist, and floral print. Includes petticoat.',
    category: 'Costume',
    tags: ['1950s', 'vintage', 'housewife', 'dress', 'retro', 'womens'],
    rental_price_per_day: 35.00,
    purchase_price: 175.00,
    image_url: 'https://images.unsplash.com/photo-1596783342566-2f8a4ac4c46c?w=800',
  },
  {
    name: 'Edwardian Walking Suit',
    description: 'Turn-of-the-century tailored walking suit with high-necked blouse and long skirt. Cream linen with lace details.',
    category: 'Costume',
    tags: ['edwardian', 'victorian', 'walking suit', 'period', 'womens', '1900s'],
    rental_price_per_day: 52.00,
    purchase_price: 395.00,
    image_url: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800',
  },
  {
    name: 'Elizabethan Court Gown',
    description: 'Lavish Elizabethan gown with brocade bodice, wide farthingale skirt, and detachable sleeves. Suitable for royalty roles.',
    category: 'Costume',
    tags: ['elizabethan', 'gown', 'shakespeare', 'royalty', 'renaissance', 'womens'],
    rental_price_per_day: 95.00,
    purchase_price: 1200.00,
    image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
  },
  {
    name: 'Pirate Captain Coat',
    description: 'Long burgundy frock coat with gold trim, brass buttons, and tricorn hat. Perfect for swashbuckling adventures.',
    category: 'Costume',
    tags: ['pirate', 'captain', 'coat', 'adventure', 'theatrical', 'menswear'],
    rental_price_per_day: 48.00,
    purchase_price: 320.00,
    image_url: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=800',
  },
  {
    name: 'Ancient Roman Toga',
    description: 'White wool toga with purple senatorial stripe. Includes leather sandals and laurel wreath.',
    category: 'Costume',
    tags: ['roman', 'toga', 'ancient', 'classical', 'shakespeare', 'julius caesar'],
    rental_price_per_day: 32.00,
    purchase_price: 195.00,
    image_url: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
  },
  {
    name: 'Regency Era Ball Gown',
    description: 'Empire waist ball gown in silk, inspired by Jane Austen era. High waistline with flowing skirt and delicate embroidery.',
    category: 'Costume',
    tags: ['regency', 'ball gown', 'jane austen', 'empire waist', 'period', 'womens'],
    rental_price_per_day: 68.00,
    purchase_price: 580.00,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
  },
  {
    name: '1970s Disco Outfit',
    description: 'White polyester disco suit with wide lapels and bell bottoms. Includes platform shoes.',
    category: 'Costume',
    tags: ['1970s', 'disco', 'bell bottoms', 'retro', 'menswear', 'vintage'],
    rental_price_per_day: 38.00,
    purchase_price: 245.00,
    image_url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800',
  },
  {
    name: 'Steampunk Aviator Ensemble',
    description: 'Victorian-inspired steampunk outfit with leather vest, brass goggles, and gear accessories.',
    category: 'Costume',
    tags: ['steampunk', 'victorian', 'aviator', 'fantasy', 'goggles', 'gears'],
    rental_price_per_day: 58.00,
    purchase_price: 425.00,
    image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea0c4c6f?w=800',
  },
  {
    name: 'Medieval Peasant Tunic',
    description: 'Simple brown linen tunic with rope belt and leather boots. Perfect for ensemble cast or village scenes.',
    category: 'Costume',
    tags: ['medieval', 'peasant', 'tunic', 'ensemble', 'period', 'simple'],
    rental_price_per_day: 25.00,
    purchase_price: 145.00,
    image_url: 'https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?w=800',
  },
  {
    name: 'Victorian Gentleman Suit',
    description: 'Three-piece Victorian suit with waistcoat, pocket watch chain, and top hat. Charcoal grey wool.',
    category: 'Costume',
    tags: ['victorian', 'suit', 'gentleman', 'formal', 'period', 'menswear'],
    rental_price_per_day: 52.00,
    purchase_price: 395.00,
    image_url: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800',
  },

  // PROPS - Essential theatrical items
  {
    name: 'Golden Crown (Royal)',
    description: 'Ornate golden crown with jewel accents. Adjustable sizing, perfect for Shakespeare royalty roles.',
    category: 'Prop',
    tags: ['crown', 'royalty', 'shakespeare', 'king', 'queen', 'golden'],
    rental_price_per_day: 22.00,
    purchase_price: 185.00,
    image_url: 'https://images.unsplash.com/photo-1585928211883-db1107e5ce0c?w=800',
  },
  {
    name: 'Ornate Wooden Throne',
    description: 'Hand-carved wooden throne with red velvet cushioning and gold leaf accents. Perfect for royal scenes.',
    category: 'Prop',
    tags: ['throne', 'chair', 'royalty', 'furniture', 'shakespeare', 'royal'],
    rental_price_per_day: 125.00,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  },
  {
    name: 'Theatrical Sword (Rapier)',
    description: 'Stage combat rapier with dulled blade and ornate hilt. Balanced for stage choreography.',
    category: 'Prop',
    tags: ['sword', 'rapier', 'weapon', 'stage combat', 'shakespeare', 'duel'],
    rental_price_per_day: 20.00,
    purchase_price: 165.00,
    image_url: 'https://images.unsplash.com/photo-1592207159486-77459fe9cd05?w=800',
  },
  {
    name: 'Crystal Ball with Stand',
    description: 'Large glass crystal ball on brass stand. Perfect for fortune teller or mystical scenes.',
    category: 'Prop',
    tags: ['crystal ball', 'mystical', 'fortune teller', 'magic', 'glass'],
    rental_price_per_day: 18.00,
    purchase_price: 125.00,
    image_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800',
  },
  {
    name: 'Vintage Typewriter (1940s)',
    description: 'Working vintage typewriter, perfect for period detective or journalist scenes.',
    category: 'Prop',
    tags: ['typewriter', '1940s', 'vintage', 'office', 'prop', 'working'],
    rental_price_per_day: 35.00,
    purchase_price: 450.00,
    image_url: 'https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=800',
  },
  {
    name: 'Ornate Silver Candelabra',
    description: 'Five-armed silver candelabra with LED candles. Perfect for gothic or period dining scenes.',
    category: 'Prop',
    tags: ['candelabra', 'candles', 'gothic', 'dining', 'silver', 'period'],
    rental_price_per_day: 28.00,
    purchase_price: 210.00,
    image_url: 'https://images.unsplash.com/photo-1607599312276-5abe8c65bb25?w=800',
  },
  {
    name: 'Vintage Rotary Telephone',
    description: 'Black bakelite rotary telephone from the 1950s. Non-working prop.',
    category: 'Prop',
    tags: ['telephone', '1950s', 'rotary', 'vintage', 'prop', 'office'],
    rental_price_per_day: 15.00,
    purchase_price: 95.00,
    image_url: 'https://images.unsplash.com/photo-1595657959743-2bc54abec0f5?w=800',
  },
  {
    name: 'Leather-Bound Books Set',
    description: 'Set of 10 antique-style leather-bound books for library or study scenes. Various sizes.',
    category: 'Prop',
    tags: ['books', 'library', 'study', 'vintage', 'leather', 'set'],
    rental_price_per_day: 25.00,
    purchase_price: 180.00,
    image_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800',
  },
  {
    name: 'Vintage Poison Bottle',
    description: 'Small glass bottle with skull and crossbones label. Safe theatrical prop for poison scenes.',
    category: 'Prop',
    tags: ['poison', 'bottle', 'shakespeare', 'romeo juliet', 'glass', 'prop'],
    rental_price_per_day: 12.00,
    purchase_price: 45.00,
    image_url: 'https://images.unsplash.com/photo-1594887805469-fdf3fb0e90e8?w=800',
  },
  {
    name: 'Medieval Scroll Set',
    description: 'Set of 5 aged parchment scrolls with wax seals. Perfect for royal decrees and period correspondence.',
    category: 'Prop',
    tags: ['scroll', 'parchment', 'medieval', 'letter', 'period', 'royal'],
    rental_price_per_day: 18.00,
    purchase_price: 85.00,
    image_url: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800',
  },
  {
    name: 'Victorian Tea Set',
    description: 'Complete porcelain tea set with teapot, cups, saucers, and serving tray. Floral pattern.',
    category: 'Prop',
    tags: ['tea set', 'victorian', 'porcelain', 'dining', 'period', 'china'],
    rental_price_per_day: 32.00,
    purchase_price: 245.00,
    image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
  },
  {
    name: 'Stage Combat Broadsword',
    description: 'Medieval-style broadsword with dulled blade. Balanced for stage combat choreography.',
    category: 'Prop',
    tags: ['sword', 'broadsword', 'medieval', 'weapon', 'stage combat', 'shakespeare'],
    rental_price_per_day: 22.00,
    purchase_price: 175.00,
    image_url: 'https://images.unsplash.com/photo-1592207159486-77459fe9cd05?w=800',
  },
  {
    name: 'Vintage Suitcase Set',
    description: 'Set of 3 leather vintage suitcases in graduated sizes. Perfect for travel scenes.',
    category: 'Prop',
    tags: ['suitcase', 'luggage', 'vintage', 'travel', 'leather', 'period'],
    rental_price_per_day: 28.00,
    purchase_price: 195.00,
    image_url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800',
  },
  {
    name: 'Ornate Hand Mirror',
    description: 'Victorian-style hand mirror with silver frame and beveled glass. Perfect for vanity scenes.',
    category: 'Prop',
    tags: ['mirror', 'victorian', 'vanity', 'silver', 'ornate', 'prop'],
    rental_price_per_day: 15.00,
    purchase_price: 85.00,
    image_url: 'https://images.unsplash.com/photo-1584015919761-36d8b9512f2e?w=800',
  },
  {
    name: 'Quill and Ink Set',
    description: 'Feather quill pen with glass inkwell and parchment paper. Perfect for writing scenes in period plays.',
    category: 'Prop',
    tags: ['quill', 'ink', 'writing', 'period', 'shakespeare', 'medieval'],
    rental_price_per_day: 12.00,
    purchase_price: 55.00,
    image_url: 'https://images.unsplash.com/photo-1583970014029-e7d7c25fe3ec?w=800',
  },

  // EQUIPMENT - Technical theatrical gear
  {
    name: 'LED Stage Light (Par Can)',
    description: 'Professional LED par can with RGBW color mixing. DMX compatible, includes mounting hardware.',
    category: 'Equipment',
    tags: ['lighting', 'led', 'stage light', 'par can', 'dmx', 'technical'],
    rental_price_per_day: 45.00,
    purchase_price: 425.00,
    image_url: 'https://images.unsplash.com/photo-1598462163419-3f21c26e7e5c?w=800',
  },
  {
    name: 'Fog Machine (Professional)',
    description: 'High-output fog machine with remote control. Includes fog fluid for 2 hours of continuous use.',
    category: 'Equipment',
    tags: ['fog machine', 'atmosphere', 'effects', 'smoke', 'technical'],
    rental_price_per_day: 65.00,
    purchase_price: 385.00,
    image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
  },
  {
    name: 'Wireless Lavalier Microphone',
    description: 'Professional wireless lavalier microphone system. Includes transmitter, receiver, and clip.',
    category: 'Equipment',
    tags: ['microphone', 'audio', 'wireless', 'lavalier', 'sound', 'technical'],
    rental_price_per_day: 55.00,
    purchase_price: 495.00,
    image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800',
  },
  {
    name: 'Spotlight (Follow Spot)',
    description: 'Manual follow spot with iris and color frame holders. Includes stand and safety cable.',
    category: 'Equipment',
    tags: ['spotlight', 'follow spot', 'lighting', 'stage', 'technical'],
    rental_price_per_day: 85.00,
    purchase_price: 1250.00,
    image_url: 'https://images.unsplash.com/photo-1559070169-a3077159ee16?w=800',
  },
  {
    name: 'Stage Monitor Speakers',
    description: 'Pair of powered stage monitor speakers, 15-inch woofers. Perfect for performer monitoring.',
    category: 'Equipment',
    tags: ['speakers', 'monitors', 'audio', 'sound', 'stage', 'technical'],
    rental_price_per_day: 75.00,
    purchase_price: 895.00,
    image_url: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800',
  },
  {
    name: 'Portable Sound Mixer',
    description: '16-channel digital sound mixer with built-in effects. Includes all cables.',
    category: 'Equipment',
    tags: ['mixer', 'audio', 'sound', 'digital', 'technical', 'console'],
    rental_price_per_day: 95.00,
    purchase_price: 1450.00,
    image_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
  },
  {
    name: 'Black Velour Stage Drapes',
    description: 'Set of professional black velour stage drapes, 20ft x 10ft. Fire-retardant, includes hardware.',
    category: 'Equipment',
    tags: ['drapes', 'curtains', 'backdrop', 'stage', 'black', 'velour'],
    rental_price_per_day: 125.00,
    purchase_price: 950.00,
    image_url: 'https://images.unsplash.com/photo-1516371535312-15e666c6ad93?w=800',
  },
  {
    name: 'Moving Head Light',
    description: 'Intelligent moving head light with gobo wheel and color mixing. DMX controlled.',
    category: 'Equipment',
    tags: ['moving head', 'intelligent lighting', 'dmx', 'stage light', 'technical'],
    rental_price_per_day: 115.00,
    purchase_price: 1650.00,
    image_url: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800',
  },
  {
    name: 'Backdrop Stand System',
    description: 'Adjustable backdrop stand system, supports 12ft wide backdrops. Includes carry case.',
    category: 'Equipment',
    tags: ['backdrop', 'stand', 'support', 'stage', 'technical', 'portable'],
    rental_price_per_day: 35.00,
    purchase_price: 245.00,
    image_url: 'https://images.unsplash.com/photo-1511578194003-00c80e42dc9b?w=800',
  },
  {
    name: 'Theater Fresnel Light Kit',
    description: 'Set of 4 Fresnel lights with barn doors and color frames. Includes stands and cables.',
    category: 'Equipment',
    tags: ['fresnel', 'lighting', 'stage light', 'kit', 'technical', 'theater'],
    rental_price_per_day: 145.00,
    purchase_price: 1850.00,
    image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
  },
];

async function seedProducts() {
  console.log('Starting product seeding...');

  try {
    // Get or create a demo owner profile
    // First, we need to create a user in Supabase Auth or use an existing one
    // For seeding purposes, you should manually create a user in Supabase and use their ID here
    console.log('Note: You need to manually set the owner_id to a valid user UUID from your Supabase Auth users');
    console.log('After creating a user in Supabase, replace the owner_id below with their UUID');

    const DEMO_OWNER_ID = '942ec7b8-e91a-4f2c-9b9c-db1e85417e87'; // Replace with actual user UUID

    if (DEMO_OWNER_ID === '51bf926f-1055-4019-a2d9-fcee854806f7') {
      throw new Error('Please set DEMO_OWNER_ID to a valid user UUID before running this script');
    }

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        console.log(`Processing: ${product.name}...`);

        // Generate embedding for the product
        // const embeddingText = createProductEmbeddingText(product);
        // const embedding = await generateEmbedding(embeddingText);

        // Insert product into database
        const { data, error } = await supabase
          .from('products')
          .insert({
            ...product,
            owner_id: DEMO_OWNER_ID,
            // embedding: embedding,
            available: true,
          })
          .select()
          .single();

        if (error) {
          console.error(`Error inserting ${product.name}:`, error.message);
          errorCount++;
        } else {
          console.log(`✓ Successfully added: ${product.name}`);
          successCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing ${product.name}:`, error);
        errorCount++;
      }
    }

    console.log('\n=== Seeding Complete ===');
    console.log(`Successfully added: ${successCount} products`);
    console.log(`Failed: ${errorCount} products`);

    // Verify products in database
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    console.log(`Total products in database: ${count}`);

  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedProducts();
