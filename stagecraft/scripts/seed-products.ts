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
    image_url: 'https://source.unsplash.com/random/800x600/?1920s,tuxedo',
  },
  {
    name: 'Replica Human Skull (Yorick)',
    description: 'Museum-quality replica human skull, anatomically accurate. The iconic prop for the graveyard scene in Hamlet. Resin construction with realistic aging and weathering.',
    category: 'Prop',
    tags: ['skull', 'yorick', 'hamlet', 'shakespeare', 'graveyard', 'prop', 'death'],
    rental_price_per_day: 15.00,
    purchase_price: 95.00,
    image_url: 'https://source.unsplash.com/random/800x600/?human,skull,yorick',
  },
  {
    name: 'Art Deco Cufflinks Set',
    description: 'Stunning silver-plated Art Deco cufflinks with geometric patterns. Perfect period accessories for 1920s formal wear.',
    category: 'Costume',
    tags: ['art deco', '1920s', 'accessories', 'cufflinks', 'jewelry', 'menswear'],
    rental_price_per_day: 8.00,
    purchase_price: 45.00,
    image_url: 'https://source.unsplash.com/random/800x600/?art,deco,cufflinks',
  },
  {
    name: 'Vintage Pocket Watch',
    description: 'Gold-plated pocket watch with chain, authentic 1920s style. Working mechanism, perfect for period productions.',
    category: 'Prop',
    tags: ['pocket watch', '1920s', 'accessory', 'prop', 'timepiece', 'vintage'],
    rental_price_per_day: 12.00,
    purchase_price: 120.00,
    image_url: 'https://source.unsplash.com/random/800x600/?vintage,pocket,watch',
  },
  {
    name: 'Art Deco Cigarette Case',
    description: 'Sleek silver cigarette case with engraved geometric patterns typical of the Jazz Age. Essential prop for 1920s productions.',
    category: 'Prop',
    tags: ['cigarette case', 'art deco', '1920s', 'prop', 'silver', 'accessory'],
    rental_price_per_day: 10.00,
    purchase_price: 65.00,
    image_url: 'https://source.unsplash.com/random/800x600/?art,deco,cigarette,case',
  },
  {
    name: 'Vintage Dagger with Sheath',
    description: 'Theatrical prop dagger with ornate handle and leather sheath. Safe dulled blade, perfect for stage combat in period dramas including Hamlet.',
    category: 'Prop',
    tags: ['dagger', 'weapon', 'hamlet', 'shakespeare', 'combat', 'stage weapon'],
    rental_price_per_day: 18.00,
    purchase_price: 140.00,
    image_url: 'https://source.unsplash.com/random/800x600/?vintage,dagger',
  },

  // COSTUMES - Period and Character-Specific
  {
    name: 'Victorian Gothic Dress',
    description: 'Floor-length black Victorian gown with high collar, lace trim, and bustle. Perfect for gothic productions, mourning scenes, or Victorian-era characters.',
    category: 'Costume',
    tags: ['victorian', 'dress', 'gothic', 'mourning', 'period', 'womens'],
    rental_price_per_day: 55.00,
    purchase_price: 450.00,
    image_url: 'https://source.unsplash.com/random/800x600/?victorian,gothic,dress',
  },
  {
    name: 'Flapper Dress (Gold Sequins)',
    description: 'Dazzling gold sequined flapper dress with fringe, perfect for 1920s productions. Knee-length with drop waist, complete with headband.',
    category: 'Costume',
    tags: ['1920s', 'flapper', 'dress', 'sequins', 'jazz age', 'womens', 'gatsby'],
    rental_price_per_day: 48.00,
    purchase_price: 320.00,
    image_url: 'https://source.unsplash.com/random/800x600/?flapper,dress,sequins',
  },
  {
    name: 'Medieval Knight Armor Set',
    description: 'Full theatrical armor set including breastplate, gauntlets, greaves, and helmet. Lightweight aluminum construction safe for stage use.',
    category: 'Costume',
    tags: ['medieval', 'armor', 'knight', 'period', 'shakespeare', 'fantasy'],
    rental_price_per_day: 85.00,
    purchase_price: 850.00,
    image_url: 'https://source.unsplash.com/random/800x600/?medieval,knight,armor',
  },
  {
    name: 'Renaissance Noble Doublet',
    description: 'Rich burgundy velvet doublet with gold trim and puffed sleeves. Suitable for Shakespeare, Renaissance faire, or Elizabethan productions.',
    category: 'Costume',
    tags: ['renaissance', 'doublet', 'shakespeare', 'elizabethan', 'noble', 'menswear'],
    rental_price_per_day: 42.00,
    purchase_price: 285.00,
    image_url: 'https://source.unsplash.com/random/800x600/?renaissance,doublet',
  },
  {
    name: '1950s Housewife Dress',
    description: 'Vintage-style 1950s day dress with full skirt, cinched waist, and floral print. Includes petticoat.',
    category: 'Costume',
    tags: ['1950s', 'vintage', 'housewife', 'dress', 'retro', 'womens'],
    rental_price_per_day: 35.00,
    purchase_price: 175.00,
    image_url: 'https://source.unsplash.com/random/800x600/?1950s,housewife,dress',
  },
  {
    name: 'Edwardian Walking Suit',
    description: 'Turn-of-the-century tailored walking suit with high-necked blouse and long skirt. Cream linen with lace details.',
    category: 'Costume',
    tags: ['edwardian', 'victorian', 'walking suit', 'period', 'womens', '1900s'],
    rental_price_per_day: 52.00,
    purchase_price: 395.00,
    image_url: 'https://source.unsplash.com/random/800x600/?edwardian,suit',
  },
  {
    name: 'Elizabethan Court Gown',
    description: 'Lavish Elizabethan gown with brocade bodice, wide farthingale skirt, and detachable sleeves. Suitable for royalty roles.',
    category: 'Costume',
    tags: ['elizabethan', 'gown', 'shakespeare', 'royalty', 'renaissance', 'womens'],
    rental_price_per_day: 95.00,
    purchase_price: 1200.00,
    image_url: 'https://source.unsplash.com/random/800x600/?elizabethan,gown',
  },
  {
    name: 'Pirate Captain Coat',
    description: 'Long burgundy frock coat with gold trim, brass buttons, and tricorn hat. Perfect for swashbuckling adventures.',
    category: 'Costume',
    tags: ['pirate', 'captain', 'coat', 'adventure', 'theatrical', 'menswear'],
    rental_price_per_day: 48.00,
    purchase_price: 320.00,
    image_url: 'https://source.unsplash.com/random/800x600/?pirate,captain,coat',
  },
  {
    name: 'Ancient Roman Toga',
    description: 'White wool toga with purple senatorial stripe. Includes leather sandals and laurel wreath.',
    category: 'Costume',
    tags: ['roman', 'toga', 'ancient', 'classical', 'shakespeare', 'julius caesar'],
    rental_price_per_day: 32.00,
    purchase_price: 195.00,
    image_url: 'https://source.unsplash.com/random/800x600/?roman,toga',
  },
  {
    name: 'Regency Era Ball Gown',
    description: 'Empire waist ball gown in silk, inspired by Jane Austen era. High waistline with flowing skirt and delicate embroidery.',
    category: 'Costume',
    tags: ['regency', 'ball gown', 'jane austen', 'empire waist', 'period', 'womens'],
    rental_price_per_day: 68.00,
    purchase_price: 580.00,
    image_url: 'https://source.unsplash.com/random/800x600/?regency,ball,gown',
  },
  {
    name: '1970s Disco Outfit',
    description: 'White polyester disco suit with wide lapels and bell bottoms. Includes platform shoes.',
    category: 'Costume',
    tags: ['1970s', 'disco', 'bell bottoms', 'retro', 'menswear', 'vintage'],
    rental_price_per_day: 38.00,
    purchase_price: 245.00,
    image_url: 'https://source.unsplash.com/random/800x600/?1970s,disco,outfit',
  },
  {
    name: 'Steampunk Aviator Ensemble',
    description: 'Victorian-inspired steampunk outfit with leather vest, brass goggles, and gear accessories.',
    category: 'Costume',
    tags: ['steampunk', 'victorian', 'aviator', 'fantasy', 'goggles', 'gears'],
    rental_price_per_day: 58.00,
    purchase_price: 425.00,
    image_url: 'https://source.unsplash.com/random/800x600/?steampunk,aviator',
  },
  {
    name: 'Medieval Peasant Tunic',
    description: 'Simple brown linen tunic with rope belt and leather boots. Perfect for ensemble cast or village scenes.',
    category: 'Costume',
    tags: ['medieval', 'peasant', 'tunic', 'ensemble', 'period', 'simple'],
    rental_price_per_day: 25.00,
    purchase_price: 145.00,
    image_url: 'https://source.unsplash.com/random/800x600/?medieval,peasant,tunic',
  },
  {
    name: 'Victorian Gentleman Suit',
    description: 'Three-piece Victorian suit with waistcoat, pocket watch chain, and top hat. Charcoal grey wool.',
    category: 'Costume',
    tags: ['victorian', 'suit', 'gentleman', 'formal', 'period', 'menswear'],
    rental_price_per_day: 52.00,
    purchase_price: 395.00,
    image_url: 'https://source.unsplash.com/random/800x600/?victorian,gentleman,suit',
  },

  // PROPS - Essential theatrical items
  {
    name: 'Golden Crown (Royal)',
    description: 'Ornate golden crown with jewel accents. Adjustable sizing, perfect for Shakespeare royalty roles.',
    category: 'Prop',
    tags: ['crown', 'royalty', 'shakespeare', 'king', 'queen', 'golden'],
    rental_price_per_day: 22.00,
    purchase_price: 185.00,
    image_url: 'https://source.unsplash.com/random/800x600/?golden,crown',
  },
  {
    name: 'Ornate Wooden Throne',
    description: 'Hand-carved wooden throne with red velvet cushioning and gold leaf accents. Perfect for royal scenes.',
    category: 'Prop',
    tags: ['throne', 'chair', 'royalty', 'furniture', 'shakespeare', 'royal'],
    rental_price_per_day: 125.00,
    image_url: 'https://source.unsplash.com/random/800x600/?ornate,wooden,throne',
  },
  {
    name: 'Theatrical Sword (Rapier)',
    description: 'Stage combat rapier with dulled blade and ornate hilt. Balanced for stage choreography.',
    category: 'Prop',
    tags: ['sword', 'rapier', 'weapon', 'stage combat', 'shakespeare', 'duel'],
    rental_price_per_day: 20.00,
    purchase_price: 165.00,
    image_url: 'https://source.unsplash.com/random/800x600/?theatrical,sword,rapier',
  },
  {
    name: 'Crystal Ball with Stand',
    description: 'Large glass crystal ball on brass stand. Perfect for fortune teller or mystical scenes.',
    category: 'Prop',
    tags: ['crystal ball', 'mystical', 'fortune teller', 'magic', 'glass'],
    rental_price_per_day: 18.00,
    purchase_price: 125.00,
    image_url: 'https://source.unsplash.com/random/800x600/?crystal,ball',
  },
  {
    name: 'Vintage Typewriter (1940s)',
    description: 'Working vintage typewriter, perfect for period detective or journalist scenes.',
    category: 'Prop',
    tags: ['typewriter', '1940s', 'vintage', 'office', 'prop', 'working'],
    rental_price_per_day: 35.00,
    purchase_price: 450.00,
    image_url: 'https://source.unsplash.com/random/800x600/?vintage,typewriter',
  },
  {
    name: 'Ornate Silver Candelabra',
    description: 'Five-armed silver candelabra with LED candles. Perfect for gothic or period dining scenes.',
    category: 'Prop',
    tags: ['candelabra', 'candles', 'gothic', 'dining', 'silver', 'period'],
    rental_price_per_day: 28.00,
    purchase_price: 210.00,
    image_url: 'https://source.unsplash.com/random/800x600/?ornate,candelabra',
  },
  {
    name: 'Vintage Rotary Telephone',
    description: 'Black bakelite rotary telephone from the 1950s. Non-working prop.',
    category: 'Prop',
    tags: ['telephone', '1950s', 'rotary', 'vintage', 'prop', 'office'],
    rental_price_per_day: 15.00,
    purchase_price: 95.00,
    image_url: 'https://source.unsplash.com/random/800x600/?vintage,rotary,telephone',
  },
  {
    name: 'Leather-Bound Books Set',
    description: 'Set of 10 antique-style leather-bound books for library or study scenes. Various sizes.',
    category: 'Prop',
    tags: ['books', 'library', 'study', 'vintage', 'leather', 'set'],
    rental_price_per_day: 25.00,
    purchase_price: 180.00,
    image_url: 'https://source.unsplash.com/random/800x600/?leather,bound,books',
  },
  {
    name: 'Vintage Poison Bottle',
    description: 'Small glass bottle with skull and crossbones label. Safe theatrical prop for poison scenes.',
    category: 'Prop',
    tags: ['poison', 'bottle', 'shakespeare', 'romeo juliet', 'glass', 'prop'],
    rental_price_per_day: 12.00,
    purchase_price: 45.00,
    image_url: 'https://source.unsplash.com/random/800x600/?vintage,poison,bottle',
  },
  {
    name: 'Medieval Scroll Set',
    description: 'Set of 5 aged parchment scrolls with wax seals. Perfect for royal decrees and period correspondence.',
    category: 'Prop',
    tags: ['scroll', 'parchment', 'medieval', 'letter', 'period', 'royal'],
    rental_price_per_day: 18.00,
    purchase_price: 85.00,
    image_url: 'https://source.unsplash.com/random/800x600/?medieval,scroll',
  },
  {
    name: 'Victorian Tea Set',
    description: 'Complete porcelain tea set with teapot, cups, saucers, and serving tray. Floral pattern.',
    category: 'Prop',
    tags: ['tea set', 'victorian', 'porcelain', 'dining', 'period', 'china'],
    rental_price_per_day: 32.00,
    purchase_price: 245.00,
    image_url: 'https://source.unsplash.com/random/800x600/?victorian,tea,set',
  },
  {
    name: 'Stage Combat Broadsword',
    description: 'Medieval-style broadsword with dulled blade. Balanced for stage combat choreography.',
    category: 'Prop',
    tags: ['sword', 'broadsword', 'medieval', 'weapon', 'stage combat', 'shakespeare'],
    rental_price_per_day: 22.00,
    purchase_price: 175.00,
    image_url: 'https://source.unsplash.com/random/800x600/?broadsword',
  },
  {
    name: 'Vintage Suitcase Set',
    description: 'Set of 3 leather vintage suitcases in graduated sizes. Perfect for travel scenes.',
    category: 'Prop',
    tags: ['suitcase', 'luggage', 'vintage', 'travel', 'leather', 'period'],
    rental_price_per_day: 28.00,
    purchase_price: 195.00,
    image_url: 'https://source.unsplash.com/random/800x600/?vintage,suitcase',
  },
  {
    name: 'Ornate Hand Mirror',
    description: 'Victorian-style hand mirror with silver frame and beveled glass. Perfect for vanity scenes.',
    category: 'Prop',
    tags: ['mirror', 'victorian', 'vanity', 'silver', 'ornate', 'prop'],
    rental_price_per_day: 15.00,
    purchase_price: 85.00,
    image_url: 'https://source.unsplash.com/random/800x600/?ornate,hand,mirror',
  },
  {
    name: 'Quill and Ink Set',
    description: 'Feather quill pen with glass inkwell and parchment paper. Perfect for writing scenes in period plays.',
    category: 'Prop',
    tags: ['quill', 'ink', 'writing', 'period', 'shakespeare', 'medieval'],
    rental_price_per_day: 12.00,
    purchase_price: 55.00,
    image_url: 'https://source.unsplash.com/random/800x600/?quill,ink',
  },

  // EQUIPMENT - Technical theatrical gear
  {
    name: 'LED Stage Light (Par Can)',
    description: 'Professional LED par can with RGBW color mixing. DMX compatible, includes mounting hardware.',
    category: 'Equipment',
    tags: ['lighting', 'led', 'stage light', 'par can', 'dmx', 'technical'],
    rental_price_per_day: 45.00,
    purchase_price: 425.00,
    image_url: 'https://source.unsplash.com/random/800x600/?led,stage,light',
  },
  {
    name: 'Fog Machine (Professional)',
    description: 'High-output fog machine with remote control. Includes fog fluid for 2 hours of continuous use.',
    category: 'Equipment',
    tags: ['fog machine', 'atmosphere', 'effects', 'smoke', 'technical'],
    rental_price_per_day: 65.00,
    purchase_price: 385.00,
    image_url: 'https://source.unsplash.com/random/800x600/?fog,machine',
  },
  {
    name: 'Wireless Lavalier Microphone',
    description: 'Professional wireless lavalier microphone system. Includes transmitter, receiver, and clip.',
    category: 'Equipment',
    tags: ['microphone', 'audio', 'wireless', 'lavalier', 'sound', 'technical'],
    rental_price_per_day: 55.00,
    purchase_price: 495.00,
    image_url: 'https://source.unsplash.com/random/800x600/?lavalier,microphone',
  },
  {
    name: 'Spotlight (Follow Spot)',
    description: 'Manual follow spot with iris and color frame holders. Includes stand and safety cable.',
    category: 'Equipment',
    tags: ['spotlight', 'follow spot', 'lighting', 'stage', 'technical'],
    rental_price_per_day: 85.00,
    purchase_price: 1250.00,
    image_url: 'https://source.unsplash.com/random/800x600/?stage,spotlight',
  },
  {
    name: 'Stage Monitor Speakers',
    description: 'Pair of powered stage monitor speakers, 15-inch woofers. Perfect for performer monitoring.',
    category: 'Equipment',
    tags: ['speakers', 'monitors', 'audio', 'sound', 'stage', 'technical'],
    rental_price_per_day: 75.00,
    purchase_price: 895.00,
    image_url: 'https://source.unsplash.com/random/800x600/?stage,monitor,speakers',
  },
  {
    name: 'Portable Sound Mixer',
    description: '16-channel digital sound mixer with built-in effects. Includes all cables.',
    category: 'Equipment',
    tags: ['mixer', 'audio', 'sound', 'digital', 'technical', 'console'],
    rental_price_per_day: 95.00,
    purchase_price: 1450.00,
    image_url: 'https://source.unsplash.com/random/800x600/?sound,mixer',
  },
  {
    name: 'Black Velour Stage Drapes',
    description: 'Set of professional black velour stage drapes, 20ft x 10ft. Fire-retardant, includes hardware.',
    category: 'Equipment',
    tags: ['drapes', 'curtains', 'backdrop', 'stage', 'black', 'velour'],
    rental_price_per_day: 125.00,
    purchase_price: 950.00,
    image_url: 'https://unsplash.com/photos/a-black-curtain-with-a-pattern-on-it-pNzunRuL3Cs',
  },
  {
    name: 'Moving Head Light',
    description: 'Intelligent moving head light with gobo wheel and color mixing. DMX controlled.',
    category: 'Equipment',
    tags: ['moving head', 'intelligent lighting', 'dmx', 'stage light', 'technical'],
    rental_price_per_day: 115.00,
    purchase_price: 1650.00,
    image_url: 'https://source.unsplash.com/random/800x600/?moving,head,light',
  },
  {
    name: 'Backdrop Stand System',
    description: 'Adjustable backdrop stand system, supports 12ft wide backdrops. Includes carry case.',
    category: 'Equipment',
    tags: ['backdrop', 'stand', 'support', 'stage', 'technical', 'portable'],
    rental_price_per_day: 35.00,
    purchase_price: 245.00,
    image_url: 'https://source.unsplash.com/random/800x600/?backdrop,stand',
  },
  {
    name: 'Theater Fresnel Light Kit',
    description: 'Set of 4 Fresnel lights with barn doors and color frames. Includes stands and cables.',
    category: 'Equipment',
    tags: ['fresnel', 'lighting', 'stage light', 'kit', 'technical', 'theater'],
    rental_price_per_day: 145.00,
    purchase_price: 1850.00,
    image_url: 'https://source.unsplash.com/random/800x600/?fresnel,light',
  },
];

// Function to get or create a demo user
async function getOrCreateDemoUser(): Promise<string> {
  const DEMO_EMAIL = 'seed_user@example.com';
  const DEMO_PASSWORD = 'password'; // This is a script, so hardcoding is fine for demo purposes

  // Check if user already exists
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    throw listError;
  }

  const demoUser = existingUsers.users.find(user => user.email === DEMO_EMAIL);

  if (demoUser) {
    console.log(`Using existing demo user: ${DEMO_EMAIL} (ID: ${demoUser.id})`);
    return demoUser.id;
  } else {
    // Create new user
    console.log(`Creating new demo user: ${DEMO_EMAIL}`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: 'Seed User',
        avatar_url: 'https://source.unsplash.com/random/150x150/?avatar'
      }
    });

    if (createError) {
      console.error('Error creating demo user:', createError);
      throw createError;
    }

    console.log(`Successfully created demo user with ID: ${newUser.user.id}`);
    return newUser.user.id;
  }
}


async function seedProducts() {
  console.log('Starting product seeding...');

  try {
    const DEMO_OWNER_ID = await getOrCreateDemoUser();
    
    // Clear existing products to avoid duplicates and FK issues if running multiple times
    console.log('Clearing existing products...');
    const { error: deleteError } = await supabase.from('products').delete().neq('owner_id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy ID
    if (deleteError) {
      console.error('Error clearing products:', deleteError.message);
      // Decide if you want to throw or continue. For seeding, often good to continue if possible.
    } else {
      console.log('Existing products cleared.');
    }

    let successCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        console.log(`Processing: ${product.name}...`);

        // Generate embedding for the product
        const embeddingText = createProductEmbeddingText(product);
        const embedding = await generateEmbedding(embeddingText);

        // Insert product into database
        const { error } = await supabase
          .from('products')
          .insert({
            ...product,
            owner_id: DEMO_OWNER_ID,
            embedding: embedding,
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
