import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface GigInput {
  title: string;
  description: string;
  production_type: string;
  location: string;
  role_name?: string;
  audition_date?: string;
  performance_dates?: string;
  posted_by: string;
}

// Realistic theatrical gig listings for demonstration
const gigs: Omit<GigInput, 'posted_by'>[] = [
  {
    title: 'Seeking Hamlet for Modern-Dress Production',
    description: 'We are casting for the lead role of Hamlet in our innovative modern-dress production set in 1920s New York. This is a fresh take on Shakespeare\'s classic tragedy, blending Jazz Age aesthetics with the timeless themes of revenge, madness, and mortality. The production runs for 8 weeks with rehearsals starting in March. Seeking a strong dramatic actor with stage combat experience. Compensation: $800/week. Requirements: Male or non-binary actor, ages 25-35. Stage combat certification preferred.',
    production_type: 'Theater',
    location: 'Chicago, IL',
    role_name: 'Hamlet',
    audition_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'March - May 2026',
  },
  {
    title: 'Ophelia - Contemporary Hamlet Production',
    description: 'Casting Ophelia for our 1920s modern-dress Hamlet. We\'re looking for an actor who can bring depth and complexity to this iconic role. Our production emphasizes Ophelia\'s agency and transforms her from victim to a fully realized character. Strong singing voice is a plus as we\'re incorporating period jazz music. Compensation: $750/week. Requirements: Female or non-binary actor, ages 20-30. Classical training preferred.',
    production_type: 'Theater',
    location: 'Chicago, IL',
    role_name: 'Ophelia',
    audition_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'March - May 2026',
  },
  {
    title: 'Costume Designer - Wicked Regional Tour',
    description: 'Seeking experienced costume designer for regional tour of Wicked. Responsible for maintaining, repairing, and adapting existing costume inventory for tour venues. Must have experience with large-scale musical productions and be comfortable working with elaborate costumes including corsetry, wings, and quick-changes. Tour covers 15 cities over 6 months. Compensation: $1,200/week + travel. Requirements: Minimum 3 years experience in professional theater. Portfolio required.',
    production_type: 'Musical',
    location: 'New York, NY (Tour)',
    audition_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'April - September 2026',
  },
  {
    title: 'Technical Director - Community Theater',
    description: 'Local community theater seeks Technical Director for our upcoming season. Responsible for lighting design, sound operation, and set construction for 4 productions throughout the year. This is a great opportunity for emerging theater technicians to build their portfolio. Experience with lighting boards (ETC Ion preferred) and sound mixing required. Compensation: $500/show. Requirements: Technical theater experience required. Lighting board certification preferred.',
    production_type: 'Theater',
    location: 'Seattle, WA',
    audition_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: '2026 Season',
  },
  {
    title: 'Ensemble Cast - A Chorus Line',
    description: 'Open auditions for ensemble roles in our production of A Chorus Line. We are seeking triple-threat performers (singing, dancing, acting) to bring this iconic musical to life. Multiple roles available. Dancers should be proficient in jazz, ballet, and contemporary styles. This is an Equity production with full benefits. Compensation: Equity Minimum ($2,034/week). Audition prep: Prepare 32 bars of a musical theater song and be ready for dance combinations.',
    production_type: 'Musical',
    location: 'Los Angeles, CA',
    role_name: 'Ensemble (Multiple Roles)',
    audition_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'May - July 2026',
  },
  {
    title: 'Props Master - Much Ado About Nothing',
    description: 'Seeking Props Master for outdoor Shakespeare production of Much Ado About Nothing. Set in 1940s Italy, this production requires period-accurate props including dining ware, letters, flowers, and military accessories. Experience with period props and outdoor theater logistics essential. 8-week contract includes rehearsals and performances. Compensation: $900/week. Requirements: Minimum 2 years props experience. Period prop expertise required.',
    production_type: 'Shakespeare',
    location: 'Portland, OR',
    audition_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'June - August 2026',
  },
  {
    title: 'Lead Actress - Steel Magnolias',
    description: 'Casting M\'Lynn Eatenton for our production of Steel Magnolias. This powerhouse role requires an actress who can navigate the full emotional range from southern charm and humor to devastating grief. Our production emphasizes the strength and resilience of southern women. Seeking an actress with strong dramatic chops and impeccable comic timing. Compensation: $650/week. Requirements: Female actor, ages 45-60. Southern accent required.',
    production_type: 'Drama',
    location: 'Nashville, TN',
    role_name: 'M\'Lynn Eatenton',
    audition_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'April - June 2026',
  },
  {
    title: 'Stage Manager - Children\'s Theater Season',
    description: 'Professional children\'s theater company seeks Stage Manager for our 2026 season. Manage 3 productions: Alice in Wonderland, The Lion King Jr., and Matilda. Experience working with young performers (ages 8-16) essential. Responsibilities include calling shows, managing rehearsals, coordinating with directors, and maintaining show documentation. Compensation: $850/week. Requirements: Stage management experience required. First Aid/CPR certification required.',
    production_type: 'Children\'s Theater',
    location: 'Boston, MA',
    audition_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'Spring-Fall 2026',
  },
  {
    title: 'Fight Choreographer - Romeo and Juliet',
    description: 'Seeking certified Fight Choreographer for our modern production of Romeo and Juliet. This visceral production features intense fight sequences including the Tybalt/Mercutio duel and the final confrontation. Must be certified by a recognized stage combat organization (SAFD, FDC, or equivalent). Experience choreographing for Shakespeare required. Compensation: $2,500 (flat fee). Requirements: SAFD certification required. Minimum 5 years experience.',
    production_type: 'Shakespeare',
    location: 'San Francisco, CA',
    audition_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'May - June 2026',
  },
  {
    title: 'Elphaba - Wicked (Cover/Understudy)',
    description: 'Seeking cover/understudy for the role of Elphaba in our production of Wicked. Must be a powerful belter with exceptional vocal range (up to high E). This is a physically demanding role requiring stamina and stage presence. Previous experience in large-scale musicals required. Must be available to step into the role with minimal notice. Compensation: Broadway Scale ($2,168/week). Requirements: Exceptional vocal ability required. Must sing up to high E.',
    production_type: 'Musical',
    location: 'Broadway, New York',
    role_name: 'Elphaba (Cover)',
    audition_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'Ongoing',
  },
  {
    title: 'Lighting Designer - Experimental Theater Festival',
    description: 'Innovative experimental theater festival seeks adventurous Lighting Designer. Design lighting for 5 original short plays exploring themes of memory, technology, and human connection. This is an opportunity to push boundaries and experiment with unconventional lighting techniques including projection mapping and interactive elements. Compensation: $1,500 (flat fee) + materials budget. Requirements: Lighting design portfolio required. Experience with projection or interactive lighting a plus.',
    production_type: 'Experimental',
    location: 'Austin, TX',
    audition_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'July 2026',
  },
  {
    title: 'Male Lead - Guys and Dolls',
    description: 'Casting Sky Masterson for our production of Guys and Dolls. This iconic role requires a strong baritone voice, leading man charisma, and ability to portray both a smooth-talking gambler and a man falling genuinely in love. Great opportunity for musical theater performers. Production runs 6 weeks with potential extension. Compensation: $725/week. Requirements: Male actor, ages 28-40. Strong baritone voice required. Dance ability helpful.',
    production_type: 'Musical',
    location: 'Minneapolis, MN',
    role_name: 'Sky Masterson',
    audition_date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'June - July 2026',
  },
  {
    title: 'Sound Designer - Immersive Horror Experience',
    description: 'Seeking Sound Designer for immersive horror theater experience. Create soundscapes and audio elements for a walk-through haunted house style theatrical production. Experience with spatial audio, ambisonic sound, and creating tension through audio design essential. This is a unique opportunity to work at the intersection of theater, gaming, and haunted attractions. Compensation: $2,000 (flat fee). Requirements: Sound design experience required. Horror/thriller genre experience preferred.',
    production_type: 'Immersive Theater',
    location: 'Las Vegas, NV',
    audition_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'October 2026',
  },
  {
    title: 'Dialect Coach - The Importance of Being Earnest',
    description: 'Professional theater company seeks Dialect Coach for our production of Oscar Wilde\'s The Importance of Being Earnest. Coach actors in authentic upper-class British Received Pronunciation (RP) accents. Work with cast during rehearsals to ensure consistency and authenticity. Previous Oscar Wilde or British period drama experience preferred. Compensation: $1,200 (flat fee). Requirements: Dialect coaching certification or equivalent experience required. Expertise in British RP accent essential.',
    production_type: 'Comedy',
    location: 'Philadelphia, PA',
    audition_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'May - June 2026',
  },
  {
    title: 'Character Actor - Dickens Festival Ensemble',
    description: 'Seeking versatile character actors for annual Dickens Christmas Festival. Performers will portray multiple Victorian-era characters including carolers, street vendors, aristocrats, and urchins. This is a month-long engagement with daily performances. Strong improvisation skills required as audience interaction is a major component. Compensation: $450/week. Requirements: Strong character work and improvisation skills required. British accent ability preferred.',
    production_type: 'Festival',
    location: 'Denver, CO',
    role_name: 'Ensemble (Multiple Characters)',
    audition_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    performance_dates: 'December 2026',
  },
];

async function seedGigs() {
  console.log('Starting gig seeding...');

  try {
    console.log('Note: You need to set DEMO_POSTER_ID to a valid user UUID from your Supabase Auth users');

    const DEMO_POSTER_ID = '942ec7b8-e91a-4f2c-9b9c-db1e85417e87'; // Replace with actual user UUID

    if (DEMO_POSTER_ID === '51bf926f-1055-4019-a2d9-fcee854806f7') {
      console.warn('WARNING: Using default UUID. Please update DEMO_POSTER_ID if this fails.');
      console.log('Creating gigs anyway - they may fail if user does not exist.');
    }

    let successCount = 0;
    let errorCount = 0;

    for (const gig of gigs) {
      try {
        console.log(`Processing: ${gig.title}...`);

        // Insert gig into database
        const { error } = await supabase
          .from('gig_listings')
          .insert({
            ...gig,
            posted_by: DEMO_POSTER_ID,
          })
          .select()
          .single();

        if (error) {
          console.error(`Error inserting ${gig.title}:`, error.message);
          errorCount++;
        } else {
          console.log(`✓ Successfully added: ${gig.title}`);
          successCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error processing ${gig.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n=== Seeding Complete ===');
    console.log(`Successfully added: ${successCount} gigs`);
    console.log(`Failed: ${errorCount} gigs`);

    // Verify gigs in database
    const { count } = await supabase
      .from('gig_listings')
      .select('*', { count: 'exact', head: true });

    console.log(`Total gigs in database: ${count}`);

  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedGigs();
