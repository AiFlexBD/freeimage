#!/usr/bin/env node

// Natural Image Generator with Unique Titles and AI Source Tracking
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Categories that need more images (less than 20 images each)
const missingCategories = [
  { id: 'music', name: 'Music', target: 30, current: 0 },
  { id: 'medieval', name: 'Medieval', target: 30, current: 0 },
  { id: 'space', name: 'Space', target: 20, current: 0 }
];

// Natural, realistic prompts - no "professional" or technical jargon
const naturalPrompts = {
  space: [
    "Stunning space photography of a massive spiral galaxy with swirling arms of stars, gas, and dust against the deep black cosmos. Captured with Hubble Space Telescope, ultra-high resolution, cosmic colors of blues, purples, and golds, professional astronomical photography",
    "Breathtaking nebula image showing colorful clouds of gas and dust where new stars are being born, with vibrant reds, blues, and greens creating a cosmic masterpiece. Space telescope photography with incredible detail and cosmic beauty",
    "Epic view of Earth from space showing the blue planet with white clouds, continents, and the thin atmosphere against the blackness of space. Astronaut photography from International Space Station, high-resolution, awe-inspiring perspective",
    "Dramatic solar system view with multiple planets aligned, showing the gas giants Jupiter and Saturn with their moons, against a starfield background. Space photography with planetary details and cosmic scale",
    "Beautiful aurora borealis from space showing green and purple lights dancing across Earth's polar regions, captured from satellite orbit. Space photography with atmospheric phenomena and cosmic lighting",
    "Stunning black hole visualization showing the event horizon with glowing accretion disk and gravitational lensing effects. Scientific space art with cosmic physics and dramatic lighting",
    "Magnificent star cluster with thousands of young blue stars shining brightly against dark nebula clouds. Deep space photography with stellar formation and cosmic colors",
    "Epic supernova explosion showing massive stellar death with expanding shock waves and brilliant light. Space photography capturing cosmic destruction and rebirth",
    "Beautiful comet with long tail streaking across the starfield, captured during close approach to Earth. Astronomical photography with cosmic motion and celestial beauty",
    "Stunning planetary ring system around a gas giant with intricate details of ice particles and gaps, illuminated by distant star. Space photography with planetary science and cosmic structure",
    "Breathtaking galaxy collision showing two massive galaxies merging with streams of stars and gas being pulled between them. Deep space photography with cosmic evolution and gravitational forces",
    "Magnificent space station orbiting Earth with solar panels gleaming in sunlight, against the backdrop of our blue planet. Space photography with human technology and cosmic perspective",
    "Stunning Mars landscape showing red rocky terrain, ancient river valleys, and distant mountains under a pink sky. Planetary photography with Martian geology and alien beauty",
    "Epic view of Saturn's moon Enceladus with geysers of water ice shooting into space from its south pole. Space photography with cryovolcanism and moon geology",
    "Beautiful exoplanet orbiting a distant star, showing potential for life with blue oceans and white clouds. Space art with astrobiology and cosmic imagination",
    "Stunning view of the Milky Way galaxy from within, showing the dense star field and dark dust lanes. Galactic photography with stellar density and cosmic structure",
    "Magnificent solar flare erupting from the Sun's surface with massive loops of plasma and magnetic fields. Solar photography with stellar activity and cosmic energy",
    "Beautiful asteroid belt showing rocky debris from planet formation, with sunlight glinting off metallic surfaces. Space photography with solar system formation and cosmic debris",
    "Epic view of Jupiter's Great Red Spot with swirling storm clouds and atmospheric bands in beautiful colors. Planetary photography with gas giant weather and cosmic storms",
    "Stunning view of the Andromeda Galaxy approaching the Milky Way, showing the future collision of our galaxies. Deep space photography with cosmic destiny and galactic evolution"
  ],
  'pixel-art': [
    "Cute pixel art of a young girl with pigtails playing with a friendly golden retriever in a sunny park. 8-bit art style with vibrant colors and heartwarming friendship",
    "Retro pixel art of a brave knight riding a majestic white horse through a magical forest. Classic RPG art style with detailed character and animal design",
    "Adorable pixel art of a cat and dog sitting together on a windowsill watching rain fall outside. 8-bit art style with cozy atmosphere and animal friendship",
    "Cute pixel art of a little boy feeding breadcrumbs to ducks in a peaceful pond. 8-bit art style with nature scene and child-animal interaction",
    "Retro pixel art of a farmer with a straw hat tending to cows in a green meadow. Classic farming game art style with rural charm and animal care",
    "Beautiful pixel art of a girl with long hair riding a bicycle with her pet bird perched on her shoulder. 8-bit art style with adventure and companionship",
    "Cute pixel art of a family of rabbits playing in a flower garden with butterflies flying around. 8-bit art style with nature beauty and animal families",
    "Retro pixel art of a cowboy character on horseback riding through a desert landscape at sunset. Classic western game art with dramatic lighting",
    "Adorable pixel art of a little girl hugging a large teddy bear in her bedroom. 8-bit art style with cozy indoor atmosphere and childhood comfort",
    "Cute pixel art of a boy and his pet turtle exploring a magical underwater world. 8-bit art style with aquatic adventure and animal friendship",
    "Retro pixel art of a princess character with a crown riding a unicorn through an enchanted forest. Classic fantasy art with magical creatures",
    "Beautiful pixel art of a girl with braids feeding carrots to horses in a stable. 8-bit art style with animal care and rural setting",
    "Cute pixel art of a boy playing fetch with his energetic puppy in a colorful garden. 8-bit art style with playful energy and pet ownership",
    "Retro pixel art of a fisherman character with a big hat catching fish with his trusty cat companion. Classic adventure game art with teamwork",
    "Adorable pixel art of a little girl with pigtails reading a book to her pet hamster. 8-bit art style with cozy indoor scene and learning",
    "Cute pixel art of a boy and his pet parrot having a conversation in a treehouse. 8-bit art style with adventure and animal communication",
    "Retro pixel art of a brave warrior with a shield and sword accompanied by a loyal wolf companion. Classic RPG art with hero and animal bond",
    "Beautiful pixel art of a girl with flowers in her hair dancing with butterflies in a meadow. 8-bit art style with nature harmony and joy",
    "Cute pixel art of a boy with glasses building a birdhouse while his pet canary watches. 8-bit art style with creativity and animal care",
    "Retro pixel art of a space explorer with a helmet and his robot dog companion on an alien planet. Classic sci-fi art with futuristic pets",
    "Adorable pixel art of a little girl with a red bow feeding a baby deer in a magical forest. 8-bit art style with nature connection and kindness",
    "Cute pixel art of a boy and his pet rabbit having a tea party in a garden. 8-bit art style with whimsical charm and animal friendship",
    "Retro pixel art of a pirate character with an eye patch and his parrot sidekick on a treasure hunt. Classic adventure game art with animal companions",
    "Beautiful pixel art of a girl with a flower crown playing hide and seek with her pet kitten. 8-bit art style with playful interaction and joy",
    "Cute pixel art of a boy with a backpack and his pet lizard exploring a jungle adventure. 8-bit art style with exploration and exotic animals",
    "Retro pixel art of a knight in shining armor with his loyal falcon companion soaring above. Classic medieval art with noble animals",
    "Adorable pixel art of a little girl with curly hair cuddling with a sleeping puppy. 8-bit art style with peaceful moment and unconditional love",
    "Cute pixel art of a boy with a fishing rod and his pet duck swimming in a pond. 8-bit art style with outdoor adventure and water animals",
    "Retro pixel art of a wizard character with a pointy hat and his magical owl familiar. Classic fantasy art with mystical animal companions",
    "Beautiful pixel art of a girl with a sun hat planting flowers while her pet butterfly lands on her finger. 8-bit art style with gardening and nature"
  ],
  music: [
    "Trendy DJ setup with turntables, mixer, and neon lights in a modern studio. Professional music production equipment with vibrant lighting and contemporary design",
    "Singer with microphone on stage under dramatic spotlight with concert atmosphere. Live music performance with dynamic lighting and audience energy",
    "Guitarist playing electric guitar with amplifier and effects pedals in a music studio. Rock music scene with professional equipment and creative atmosphere",
    "Pianist at grand piano in elegant concert hall with warm stage lighting. Classical music performance with sophisticated ambiance and artistic beauty",
    "Drummer behind drum kit with cymbals and sticks in action during live performance. Dynamic music scene with energy and rhythm",
    "Music producer working on laptop with headphones in modern recording studio. Digital music creation with professional audio equipment and creative workspace",
    "Saxophone player in jazz club with warm lighting and intimate atmosphere. Live jazz performance with vintage instruments and cozy setting",
    "Violinist playing in orchestra with sheet music and conductor in background. Classical ensemble performance with formal concert setting",
    "Bassist with electric bass guitar and amplifier in band rehearsal space. Rock band practice with musical instruments and creative environment",
    "Singer-songwriter with acoustic guitar in cozy coffee shop setting. Intimate acoustic performance with warm lighting and relaxed atmosphere",
    "Electronic music producer with synthesizers and MIDI controllers in home studio. Modern music production with digital instruments and creative technology",
    "Concert crowd with hands raised and phone lights during live music performance. Audience engagement with concert energy and shared musical experience",
    "Vinyl record collection with turntable and vintage speakers in retro music room. Analog music listening with classic equipment and nostalgic atmosphere",
    "Music festival stage with colorful lights and large crowd dancing. Outdoor music event with festival atmosphere and vibrant energy",
    "Recording studio control room with mixing board and studio monitors. Professional audio production with high-end equipment and technical precision",
    "Street musician playing guitar on city sidewalk with open case for tips. Urban music performance with authentic street art and city atmosphere",
    "Music streaming setup with podcast microphone and recording equipment. Digital content creation with modern audio technology and professional quality",
    "Jazz trio performance with piano, bass, and drums in intimate club setting. Live jazz music with sophisticated instruments and cozy ambiance",
    "Rock band on stage with electric guitars, drums, and powerful stage lighting. High-energy concert performance with dramatic lighting and musical intensity",
    "Classical cellist in formal concert attire playing in elegant music hall. Orchestral performance with refined setting and artistic elegance",
    "Hip-hop producer with beat machine and studio equipment in urban music studio. Modern rap production with contemporary technology and creative workspace",
    "Acoustic duo with guitar and vocals in outdoor park setting. Natural music performance with organic instruments and outdoor ambiance",
    "Music video filming with camera crew and artist performing on set. Visual music production with professional filming equipment and creative direction",
    "Music store with guitars, keyboards, and instruments displayed for sale. Musical instrument retail with variety of equipment and shopping atmosphere",
    "Concert photographer capturing live music performance with professional camera. Music documentation with artistic photography and concert energy",
    "Music teacher giving piano lesson to student in cozy home setting. Educational music scene with learning environment and mentorship",
    "Music streaming playlist creation on laptop with headphones and coffee. Digital music curation with modern technology and personal listening",
    "Music therapy session with therapist and patient using instruments. Healing through music with therapeutic instruments and supportive environment",
    "Music awards ceremony with red carpet and celebrity musicians. Formal music industry event with glamorous setting and professional recognition",
    "Music rehearsal space with band equipment and soundproofing materials. Practice environment with musical instruments and creative preparation"
  ],
  medieval: [
    "Medieval village with stone houses, cobblestone streets, and a central marketplace. Fantasy game art style with detailed architecture and rustic charm",
    "Medieval castle on a hilltop with tall towers, battlements, and a drawbridge. Epic fantasy setting with dramatic lighting and imposing fortress design",
    "Medieval tavern with wooden beams, flickering candles, and travelers gathered around tables. Cozy fantasy atmosphere with warm lighting and rustic interior",
    "Medieval blacksmith workshop with anvil, forge, and glowing embers. Traditional craftsmanship scene with tools and metalworking equipment",
    "Medieval knight in shining armor riding a warhorse through a forest path. Heroic fantasy scene with detailed armor and noble steed",
    "Medieval village square with a stone fountain, market stalls, and villagers going about their daily lives. Lively fantasy town with bustling activity",
    "Medieval wizard tower with spiral staircase, magical books, and glowing crystals. Mystical fantasy architecture with arcane atmosphere",
    "Medieval farmhouse with thatched roof, wooden fence, and fields of wheat. Rural fantasy setting with pastoral beauty and simple living",
    "Medieval cathedral with stained glass windows, stone pillars, and candlelit interior. Sacred fantasy architecture with spiritual atmosphere",
    "Medieval dragon perched on a castle tower with wings spread and fire breathing. Epic fantasy creature with detailed scales and dramatic pose",
    "Medieval marketplace with merchants selling goods, colorful banners, and bustling crowds. Vibrant fantasy commerce with lively trading activity",
    "Medieval forest path with ancient trees, moss-covered stones, and dappled sunlight. Enchanted woodland with mystical atmosphere and natural beauty",
    "Medieval siege scene with catapults, archers on walls, and soldiers in formation. Epic battle preparation with military strategy and fortress defense",
    "Medieval alchemist laboratory with bubbling potions, ancient books, and magical ingredients. Mystical workshop with arcane experiments and magical atmosphere",
    "Medieval village at sunset with warm golden light on stone buildings and smoke rising from chimneys. Peaceful fantasy scene with cozy evening atmosphere",
    "Medieval tournament grounds with jousting arena, colorful tents, and noble spectators. Chivalric competition with knights and medieval pageantry",
    "Medieval dungeon with stone walls, iron bars, and flickering torchlight. Dark fantasy setting with mysterious atmosphere and ancient secrets",
    "Medieval herbalist garden with medicinal plants, stone pathways, and wooden benches. Healing sanctuary with natural remedies and peaceful atmosphere",
    "Medieval port town with wooden ships, stone quays, and seagulls flying overhead. Coastal fantasy settlement with maritime activity and ocean views",
    "Medieval library with towering bookshelves, reading desks, and ancient scrolls. Scholarly fantasy setting with knowledge and wisdom",
    "Medieval windmill on a hill with rotating blades and stone foundation. Rural fantasy landmark with pastoral beauty and traditional technology",
    "Medieval bridge over a river with stone arches and moss-covered stones. Architectural fantasy landmark with natural integration and timeless design",
    "Medieval village festival with colorful decorations, music, and dancing villagers. Joyful fantasy celebration with community spirit and merriment",
    "Medieval watchtower on a cliff with panoramic views of the surrounding landscape. Strategic fantasy outpost with defensive positioning and scenic vistas",
    "Medieval stables with horses, hay bales, and wooden stalls. Equestrian fantasy setting with animal care and rural lifestyle",
    "Medieval apothecary shop with glass bottles, wooden shelves, and healing potions. Medical fantasy establishment with remedies and care",
    "Medieval village well with stone rim, wooden bucket, and villagers gathering water. Community fantasy landmark with daily life and social interaction",
    "Medieval forge with glowing metal, hammer and anvil, and sparks flying. Traditional fantasy craftsmanship with skilled metalworking and fire",
    "Medieval inn with wooden sign, warm windows, and travelers arriving. Hospitality fantasy establishment with comfort and rest for weary adventurers",
    "Medieval village gate with wooden doors, stone walls, and guards on duty. Defensive fantasy entrance with security and protection for the community"
  ],
  architecture: [
    "Ultra-realistic architectural photography of modern glass skyscraper with geometric patterns reflecting golden hour light. Shot with Canon EOS R5, 24-70mm lens, f/8, shallow depth of field, high-resolution, cinematic detail, crisp textures, professional architectural photography",
    "Stunning contemporary building facade with clean lines and dramatic shadows. Captured with Sony A7R IV, 16-35mm wide-angle lens, f/11, perfect exposure, high-resolution, architectural detail, professional real estate photography",
    "Futuristic building design with innovative materials and sustainable features. Photographed with Nikon Z9, 14-24mm lens, f/9, golden hour lighting, high-resolution, architectural photography, magazine quality",
    "Historic building restoration with modern elements blending seamlessly. Shot with Canon EOS R6, 50mm lens, f/5.6, natural lighting, high-resolution, architectural detail, professional photography",
    "Minimalist modern home with clean geometric forms and natural materials. Captured with Sony A7R V, 35mm lens, f/7.1, soft natural light, high-resolution, architectural photography, lifestyle magazine quality"
  ],
  business: [
    "Professional business meeting in modern conference room with glass walls and city view. Shot with Canon EOS R5, 85mm lens, f/2.8, natural lighting, high-resolution, corporate photography, professional atmosphere",
    "Successful entrepreneur working in sleek modern office with laptop and coffee. Captured with Sony A7R IV, 50mm lens, f/4, soft window light, high-resolution, business lifestyle photography, magazine quality",
    "Handshake between business partners in contemporary office lobby. Photographed with Nikon Z9, 70-200mm lens, f/5.6, professional lighting, high-resolution, corporate photography, authentic moment",
    "Team collaboration in open-plan office with natural light and modern furniture. Shot with Canon EOS R6, 24-70mm lens, f/6.3, ambient lighting, high-resolution, workplace photography, professional quality",
    "Business presentation with charts and graphs on large screen in boardroom. Captured with Sony A7R V, 35mm lens, f/8, controlled lighting, high-resolution, corporate photography, professional atmosphere"
  ],
  food: [
    "Gourmet dish presentation with fresh ingredients and artistic plating. Shot with Canon EOS R5, 100mm macro lens, f/4, natural lighting, high-resolution, food photography, restaurant quality, shallow depth of field",
    "Fresh organic vegetables arranged beautifully on wooden cutting board. Captured with Sony A7R IV, 90mm lens, f/5.6, soft window light, high-resolution, food styling, magazine quality photography",
    "Artisanal bread and pastries in rustic bakery setting with warm lighting. Photographed with Nikon Z9, 85mm lens, f/3.5, natural lighting, high-resolution, food photography, lifestyle magazine quality",
    "Elegant dessert presentation with chocolate and berries on fine china. Shot with Canon EOS R6, 105mm macro lens, f/4.5, controlled lighting, high-resolution, food photography, restaurant quality",
    "Fresh seafood display with lemons and herbs in coastal restaurant setting. Captured with Sony A7R V, 50mm lens, f/6.3, natural lighting, high-resolution, food photography, professional quality"
  ],
  people: [
    "Portrait of diverse professional in natural outdoor setting with soft lighting. Shot with Canon EOS R5, 85mm lens, f/2.8, golden hour light, high-resolution, portrait photography, natural expressions, professional quality",
    "Candid moment of person laughing in urban environment with street photography style. Captured with Sony A7R IV, 50mm lens, f/4, available light, high-resolution, lifestyle photography, authentic emotion",
    "Professional headshot with clean background and natural lighting. Photographed with Nikon Z9, 105mm lens, f/5.6, studio lighting, high-resolution, corporate photography, professional quality",
    "Person reading in cozy cafe with warm ambient lighting and bokeh background. Shot with Canon EOS R6, 50mm lens, f/2.2, natural light, high-resolution, lifestyle photography, intimate moment",
    "Group of friends enjoying outdoor activity with natural expressions and lighting. Captured with Sony A7R V, 35mm lens, f/6.3, daylight, high-resolution, lifestyle photography, authentic moments"
  ],
  travel: [
    "Breathtaking mountain landscape with dramatic clouds and golden hour lighting. Shot with Canon EOS R5, 16-35mm lens, f/11, natural lighting, high-resolution, landscape photography, professional quality",
    "Historic city street with charming architecture and local culture. Captured with Sony A7R IV, 24-70mm lens, f/8, available light, high-resolution, travel photography, documentary style",
    "Tropical beach with crystal clear water and palm trees at sunset. Photographed with Nikon Z9, 14-24mm lens, f/9, golden hour, high-resolution, travel photography, magazine quality",
    "Ancient temple with intricate details and dramatic lighting. Shot with Canon EOS R6, 70-200mm lens, f/6.3, natural light, high-resolution, travel photography, cultural documentation",
    "Urban skyline at night with city lights and long exposure technique. Captured with Sony A7R V, 24mm lens, f/16, long exposure, high-resolution, cityscape photography, professional quality"
  ],
  abstract: [
    "Abstract geometric patterns with vibrant colors and dynamic composition. Shot with Canon EOS R5, 50mm lens, f/8, controlled lighting, high-resolution, abstract photography, artistic composition",
    "Fluid motion captured with long exposure creating ethereal abstract forms. Captured with Sony A7R IV, 85mm lens, f/11, long exposure, high-resolution, abstract photography, artistic expression",
    "Minimalist abstract composition with negative space and subtle textures. Photographed with Nikon Z9, 105mm lens, f/6.3, natural lighting, high-resolution, abstract art, gallery quality",
    "Color field abstraction with bold hues and geometric shapes. Shot with Canon EOS R6, 35mm lens, f/9, studio lighting, high-resolution, abstract photography, modern art style",
    "Textural abstract with organic forms and natural lighting creating depth. Captured with Sony A7R V, 60mm lens, f/7.1, natural light, high-resolution, abstract photography, artistic vision"
  ],
  nature: [
    "Majestic forest with towering trees and dappled sunlight filtering through canopy. Shot with Canon EOS R5, 16-35mm lens, f/11, natural lighting, high-resolution, nature photography, professional quality",
    "Serene lake reflection with mountains and dramatic sky at golden hour. Captured with Sony A7R IV, 24-70mm lens, f/9, natural light, high-resolution, landscape photography, magazine quality",
    "Wildflower meadow with vibrant colors and shallow depth of field. Photographed with Nikon Z9, 105mm macro lens, f/4, natural lighting, high-resolution, nature photography, artistic composition",
    "Waterfall cascading over rocks with long exposure creating silky water effect. Shot with Canon EOS R6, 14-24mm lens, f/16, long exposure, high-resolution, nature photography, professional technique",
    "Autumn forest with colorful leaves and misty atmosphere creating mood. Captured with Sony A7R V, 70-200mm lens, f/8, natural lighting, high-resolution, nature photography, seasonal beauty"
  ],
  technology: [
    "Modern smartphone with sleek design and premium materials in studio lighting. Shot with Canon EOS R5, 100mm macro lens, f/8, controlled lighting, high-resolution, product photography, professional quality",
    "Futuristic computer setup with RGB lighting and modern peripherals. Captured with Sony A7R IV, 50mm lens, f/6.3, ambient lighting, high-resolution, tech photography, lifestyle magazine quality",
    "Abstract circuit board patterns with metallic textures and geometric forms. Photographed with Nikon Z9, 105mm macro lens, f/11, studio lighting, high-resolution, tech photography, artistic composition",
    "Smart home devices integrated seamlessly into modern living space. Shot with Canon EOS R6, 35mm lens, f/7.1, natural lighting, high-resolution, lifestyle photography, technology integration",
    "High-tech laboratory with advanced equipment and clean modern design. Captured with Sony A7R V, 24-70mm lens, f/9, professional lighting, high-resolution, tech photography, scientific atmosphere"
  ],
  lifestyle: [
    "Ultra-realistic photo of a person reading a leather-bound book in a cozy coffee shop corner. Warm golden afternoon light streams through large vintage windows, creating soft bokeh and natural rim lighting. Shot with Canon EOS R5, 85mm f/1.4 lens, shallow depth of field, the background gently blurred with coffee steam and warm wood textures. Cinematic color grading, film grain texture, magazine-quality lifestyle photography",
    "Ultra-realistic photo of a joyful family cooking together in a bright modern kitchen. Golden hour sunlight streams through large windows, creating soft warm highlights and natural shadows. The countertops shine with fresh vegetables, herbs, and colorful ingredients. Parents and children laugh as they chop, stir, and taste food together. Captured with Canon EOS R5, 50mm lens, shallow depth of field, high-resolution, cinematic detail, crisp textures, skin tones natural and vibrant, magazine-quality lifestyle photography",
    "Breathtaking sunrise yoga session on a modern apartment balcony overlooking a sprawling city skyline. A woman in flowing yoga attire performs a graceful pose as golden morning light bathes the scene. Shot with Sony A7R IV, 35mm f/1.8 lens, perfect focus on the subject with the city softly blurred in the background. Cinematic lighting, warm color temperature, professional fitness photography with natural skin tones and fabric textures",
    "Idyllic picnic scene under a majestic oak tree in a sun-dappled park. Friends spread across a vintage blanket with gourmet food, laughing and enjoying each other's company. Captured during golden hour with Canon 5D Mark IV, 24-70mm f/2.8 lens, natural lighting filtering through leaves creating beautiful light patterns. Shallow depth of field, warm color palette, lifestyle magazine quality with rich textures and authentic emotions",
    "Inspiring home office workspace with a man working at a modern desk surrounded by lush green plants and a breathtaking mountain view through floor-to-ceiling windows. Natural morning light illuminates the space perfectly. Shot with Nikon Z7 II, 24mm f/1.4 lens, sharp focus throughout, architectural photography style with clean lines, natural colors, and professional interior design aesthetics",
    "Couple walking dog through neighborhood street lined with autumn trees",
    "Children playing in backyard garden with colorful flowers blooming",
    "Woman meditating peacefully in living room with soft natural lighting",
    "Group of friends sharing meal at outdoor restaurant patio",
    "Person organizing closet with neatly folded clothes and natural light",
    "Family movie night in living room with cozy blankets and popcorn",
    "Woman tending to herb garden on sunny kitchen windowsill",
    "Man riding bicycle through quiet suburban neighborhood in morning",
    "Friends playing board games around wooden dining table",
    "Person enjoying hot tea while reading magazine in armchair",
    "Couple preparing breakfast together in sunlit kitchen",
    "Children building fort with pillows and blankets in bedroom",
    "Woman writing in journal at desk near large bright window",
    "Family having barbecue in backyard with string lights overhead",
    "Person organizing books on wooden shelves in home library"
  ],
  animals: [
    "Stunning wildlife photograph of a golden retriever in mid-leap catching a tennis ball in a wildflower meadow. Shot with Canon EOS-1D X Mark III, 400mm f/2.8 lens, 1/2000s shutter speed to freeze the action. Golden hour lighting creates a warm glow on the dog's fur, with wildflowers beautifully blurred in the foreground and background. National Geographic style, tack-sharp focus on the eyes, natural colors, professional animal photography",
    "Serene portrait of an orange tabby cat sleeping peacefully on a sun-warmed wooden windowsill. Soft morning light filters through sheer curtains, creating gentle shadows and highlighting the cat's fur texture. Captured with Sony A7R IV, 85mm f/1.4 lens, extremely shallow depth of field, the background melting into creamy bokeh. Intimate pet photography with natural lighting, warm color tones, and exquisite detail in the whiskers and fur",
    "Breathtaking wildlife photograph of a majestic bald eagle soaring high above snow-capped mountain peaks with dramatic clouds. Shot with Nikon D850, 600mm f/4 lens, 1/1600s shutter speed, the eagle perfectly sharp against the soft cloud formations. Epic landscape backdrop with cinematic lighting, rich contrast, and stunning detail in the feathers. Professional nature photography worthy of National Geographic",
    "Heartwarming wildlife scene of a baby elephant walking closely beside its mother through golden African savanna grassland at sunset. Captured with Canon EOS R6, 300mm f/2.8 lens, natural warm lighting creating silhouettes and rim lighting on the elephants. Dust particles visible in the golden light, acacia trees in the background, authentic African wildlife photography with emotional depth and stunning natural beauty",
    "Vibrant close-up portrait of a scarlet macaw perched on a moss-covered branch in the Costa Rican rainforest. Shot with Sony A9 II, 200mm f/2.8 lens, perfect focus on the bird's intelligent eye with the lush green jungle beautifully blurred behind. Natural diffused light filtering through the canopy, showcasing the brilliant red, blue, and yellow feathers in stunning detail. Professional bird photography with rich tropical colors",
    "Dolphin jumping gracefully out of clear blue ocean water",
    "Red fox walking through snow-covered forest in winter",
    "Butterfly landing delicately on bright purple flower in garden",
    "Horse galloping freely across open field at sunset",
    "Owl sitting quietly on moss-covered branch in ancient forest",
    "Penguin colony gathered on icy Antarctic shoreline",
    "Hummingbird hovering near red flowers in summer garden",
    "Wolf pack resting together in mountain wilderness",
    "Sea turtle swimming through coral reef in turquoise water",
    "Deer drinking from crystal clear stream in peaceful forest",
    "Monkey swinging through lush green jungle canopy",
    "Bear catching salmon in rushing mountain river",
    "Rabbit sitting in meadow surrounded by spring daisies",
    "Whale breaching ocean surface with water cascading down",
    "Squirrel gathering acorns in park during autumn season"
  ],
  sports: [
    "Dynamic sports photograph of a basketball player in mid-dunk against a stunning city skyline backdrop. Shot with Canon EOS-1D X Mark III, 70-200mm f/2.8 lens, 1/1000s shutter speed to freeze the action perfectly. Golden hour lighting creates dramatic rim lighting on the athlete's silhouette. Urban outdoor court with the city's glass towers reflecting warm sunset colors. Professional sports photography with tack-sharp focus, high contrast, and cinematic composition",
    "Spectacular action shot of a soccer player striking the ball with perfect form on a pristine grass field. Captured with Sony A9 II, 400mm f/2.8 lens, 1/2000s shutter speed, the ball frozen mid-kick with grass particles flying. Stadium lighting creates dramatic shadows and highlights on the player's uniform. Goal posts perfectly framed in the background with shallow depth of field. ESPN-quality sports photography with vibrant colors and incredible detail",
    "Professional tennis photography capturing the precise moment of a powerful serve on a clay court. Shot with Nikon D6, 300mm f/2.8 lens, 1/1600s shutter speed, the racket strings and ball perfectly sharp. Natural stadium lighting highlights the clay dust and the player's intense concentration. Net and court lines create perfect leading lines. Wimbledon-quality sports photography with rich textures and authentic athletic emotion",
    "Stunning aquatic photography of an Olympic swimmer cutting through crystal-clear pool water. Captured with underwater housing, Canon EOS R5, 16-35mm f/2.8 lens, 1/500s shutter speed. Perfect lighting illuminates the swimmer's streamlined form and the water's surface patterns. Lane markers create beautiful leading lines. Professional swimming photography with incredible water clarity and dynamic composition",
    "Inspiring trail running photograph of athletic shoes on a forest path covered with golden autumn leaves. Shot with Sony A7R IV, 85mm f/1.4 lens, shallow depth of field creating beautiful bokeh from the colorful foliage. Natural forest lighting filters through the canopy, creating dappled light patterns. The shoes show authentic wear and mud, capturing the essence of trail running. Outdoor sports photography with rich autumn colors and natural textures",
    "Classic baseball photography featuring a worn leather glove and pristine white baseball on emerald stadium grass. Shot with Canon 5D Mark IV, 100mm f/2.8 macro lens, shallow depth of field with the stadium seats beautifully blurred in the background. Warm evening light creates perfect shadows and highlights on the leather texture. Professional sports equipment photography with rich colors and nostalgic American baseball atmosphere",
    "Adventure mountain biking photograph of a high-end bicycle leaning against a weathered pine tree on a rugged mountain trail. Captured with Nikon Z7 II, 24-70mm f/2.8 lens, the dramatic mountain vista stretching into the distance. Golden hour lighting illuminates the bike's frame and the tree's bark texture. Professional outdoor sports photography with breathtaking landscape and adventure spirit",
    "Pristine golf photography of a Titleist golf ball positioned perfectly near the hole on an immaculate green. Shot with Sony A7R IV, 90mm f/2.8 macro lens, extreme shallow depth of field creating dreamy bokeh of the fairway beyond. Early morning light with dew drops visible on the grass blades. Professional golf photography with country club elegance and precision detail",
    "Epic surfing photography of a colorful longboard standing upright on golden beach sand with powerful waves crashing in the background. Captured with Canon EOS R6, 70-200mm f/2.8 lens, fast shutter speed to freeze the wave action. Sunset lighting creates silhouettes and warm color temperature. Professional surf photography with California beach vibes and ocean power",
    "Extreme adventure photography of professional rock climbing gear hanging from a dramatic cliff face with mountain peaks in the background. Shot with Sony A9 II, 16-35mm f/2.8 lens, wide angle to capture the vertical scale. Natural mountain lighting with deep shadows and highlights on the metal gear. Professional climbing photography with breathtaking alpine scenery and adventure spirit",
    "Magical winter sports photography of pristine white ice skates on a frozen pond with perfect reflections of the cloudy winter sky. Shot with Canon EOS R5, 85mm f/1.4 lens, the ice surface acting as a natural mirror. Soft overcast lighting creates even illumination without harsh shadows. Professional winter sports photography with serene atmosphere and perfect symmetry",
    "Dynamic beach volleyball photograph of a professional net setup with powerful ocean waves crashing in the background. Captured with Sony A7R IV, 24-70mm f/2.8 lens, fast shutter speed to freeze the wave action. Golden hour lighting creates warm sand tones and dramatic wave textures. Professional beach sports photography with tropical energy and athletic atmosphere",
    "Peaceful kayaking photography of a wooden paddle resting across a sleek kayak on mirror-calm lake water. Shot with Nikon Z7 II, 50mm f/1.8 lens, the mountain reflection creating perfect symmetry in the water. Early morning mist and soft lighting create a serene atmosphere. Professional outdoor recreation photography with zen-like tranquility and natural beauty",
    "Powerful boxing photography of worn leather gloves hanging in a gritty gym with dramatic natural light streaming through industrial windows. Captured with Canon 5D Mark IV, 35mm f/1.4 lens, creating strong contrast and shadows. The gloves show authentic wear and character. Professional boxing photography with raw athletic atmosphere and urban gym authenticity",
    "Zen yoga photography of a premium yoga mat elegantly rolled up on a wooden deck overlooking a breathtaking mountain landscape. Shot with Sony A7R IV, 85mm f/1.8 lens, shallow depth of field with the vista beautifully blurred. Golden hour lighting creates warm wood tones and peaceful atmosphere. Professional wellness photography with mindfulness and natural serenity",
    "Skateboard on concrete ramp in urban skate park",
    "Fishing rod cast into peaceful river at sunrise",
    "Hiking boots on rocky mountain trail with vista ahead",
    "Badminton shuttlecock frozen mid-air above net on court",
    "Archery target with arrows in bullseye at outdoor range"
  ],
  fashion: [
    "Exquisite fashion photography of an elegant black evening dress hanging on a vintage wooden hanger beside a large window. Soft natural light streams through sheer curtains, creating beautiful shadows and highlights on the fabric's texture. Shot with Canon EOS R5, 85mm f/1.4 lens, shallow depth of field with the window beautifully blurred. Professional fashion photography with rich fabric details, cinematic lighting, and Vogue magazine quality",
    "Luxury fashion still life of a premium leather handbag on a polished marble table with dramatic lighting. Shot with Sony A7R IV, 100mm f/2.8 macro lens, perfect focus on the leather texture and stitching details. Soft studio lighting creates elegant shadows and highlights. Professional product photography with rich textures, warm color tones, and commercial fashion quality",
    "Artistic fashion photograph of a silk scarf gracefully draped over an antique wooden chair arm. Natural window light illuminates the silk's lustrous surface and flowing lines. Captured with Nikon Z7 II, 105mm f/2.8 lens, shallow depth of field creating beautiful bokeh. Professional fashion styling photography with elegant composition, natural colors, and textile magazine quality",
    "High-end fashion photography of designer shoes perfectly arranged on a modern closet shelf with natural lighting. Shot with Canon 5D Mark IV, 50mm f/1.8 lens, clean composition with perfect shadows and highlights on the leather. Minimalist styling with architectural lines and luxury fashion aesthetics. Professional product photography with sharp details and elegant presentation",
    "Elegant jewelry photography of a lustrous pearl necklace displayed on rich velvet cushion in a luxury jewelry box. Shot with Sony A7R IV, 90mm f/2.8 macro lens, perfect focus on each pearl's surface with beautiful light reflections. Soft diffused lighting creates elegant highlights. Professional jewelry photography with exquisite detail, rich textures, and Tiffany & Co quality presentation",
    "Casual fashion photography of a vintage denim jacket draped over a rustic cafe chair with warm afternoon light streaming through windows. The jacket's worn texture and faded blue color create authentic character. Shot with Canon 5D Mark IV, 50mm f/1.8 lens, shallow depth of field with the cafe atmosphere softly blurred. Professional lifestyle fashion photography with natural lighting and authentic street style aesthetics",
    "Stylish fashion photograph of designer sunglasses reflecting brilliant sunset colors on a wooden beach boardwalk. The lenses capture the golden hour sky and ocean waves in perfect reflection. Captured with Sony A7R IV, 85mm f/1.4 lens, macro focus on the reflections with the boardwalk beautifully blurred. Professional accessory photography with dramatic lighting and coastal luxury lifestyle",
    "Elegant timepiece photography of a vintage Swiss watch lying on a polished wooden desk beside a steaming cup of morning coffee. Warm natural light illuminates the watch face and leather strap details. Shot with Nikon Z7 II, 105mm f/2.8 macro lens, perfect focus on the watch mechanism with coffee steam creating atmospheric elements. Professional luxury watch photography with sophisticated morning routine aesthetics",
    "Romantic fashion photograph of a flowing floral summer dress swaying gently in a garden breeze with wildflowers in the background. Natural sunlight creates beautiful fabric movement and color vibrancy. Captured with Canon EOS R6, 85mm f/1.2 lens, fast shutter speed to freeze the fabric motion with dreamy bokeh. Professional fashion photography with natural movement and feminine elegance",
    "Luxury fashion still life of a premium cashmere sweater folded neatly on crisp white hotel linens with soft morning light. The sweater's texture and rich color contrast beautifully with the pristine bedding. Shot with Sony A7R IV, 90mm f/2.8 lens, perfect focus on fabric texture with elegant minimalist composition. Professional luxury fashion photography with hotel suite sophistication",
    "Glamorous jewelry photography of statement diamond earrings catching brilliant light on a luxury display stand. Each facet sparkles with rainbow reflections against a dark velvet background. Shot with Canon EOS R5, 100mm f/2.8 macro lens, perfect focus on the diamonds with dramatic lighting creating stunning sparkle effects. Professional high-end jewelry photography with luxury boutique quality and exquisite detail",
    "Sophisticated fashion photograph of premium leather boots standing by an elegant doorway with a classic umbrella nearby. Soft natural light illuminates the leather's rich texture and craftsmanship details. Captured with Sony A7R IV, 85mm f/1.8 lens, shallow depth of field with the doorway architecture beautifully blurred. Professional footwear photography with European elegance and rainy day sophistication",
    "Elegant fashion photography of a silk blouse hanging gracefully in a modern walk-in closet with natural lighting streaming through skylights. The silk's lustrous surface and flowing lines create beautiful shadows and highlights. Shot with Nikon Z7 II, 50mm f/1.4 lens, perfect exposure balancing the silk texture with architectural closet design. Professional luxury fashion photography with minimalist elegance",
    "Luxury fashion still life of a designer leather belt coiled elegantly on a marble dresser surface with soft morning light. The belt's rich texture and gold hardware create sophisticated contrast against the polished stone. Captured with Canon 5D Mark IV, 90mm f/2.8 lens, macro focus on leather grain and hardware details. Professional accessory photography with Italian luxury craftsmanship",
    "Dramatic fashion photograph of an evening gown flowing gracefully across a marble bedroom floor with romantic lighting. The gown's fabric creates beautiful curves and shadows in the elegant space. Shot with Sony A9 II, 35mm f/1.4 lens, wide angle to capture the gown's full dramatic impact with architectural elements. Professional haute couture photography with red carpet elegance and luxury hotel suite aesthetics",
    "Classic fashion photography of a wool coat hanging on a brass hook beside an elegant front door entrance with autumn leaves visible outside. Natural light creates beautiful texture on the wool fabric and architectural details. Shot with Canon EOS R6, 85mm f/1.8 lens, shallow depth of field with the entrance beautifully framed. Professional outerwear photography with seasonal elegance and European sophistication",
    "Delicate jewelry photography of a fine bracelet resting on a woman's wrist in soft morning light streaming through sheer curtains. The bracelet's precious metals and stones catch the light beautifully against natural skin tones. Captured with Sony A7R IV, 105mm f/2.8 macro lens, perfect focus on jewelry details with dreamy bokeh. Professional fine jewelry photography with intimate elegance and luxury craftsmanship",
    "Charming lifestyle fashion photograph of a woven summer hat sitting on a white porch railing with a lush garden view in the background. Golden hour light creates warm shadows and highlights on the hat's texture. Shot with Nikon Z7 II, 85mm f/1.4 lens, shallow depth of field with the garden beautifully blurred. Professional summer fashion photography with coastal cottage elegance",
    "Sophisticated retail fashion photography of a cocktail dress displayed in an upscale boutique window with urban street reflections creating artistic depth. Evening city lights reflect in the glass creating a glamorous atmosphere. Captured with Canon 5D Mark IV, 35mm f/1.4 lens, balancing interior lighting with street reflections. Professional retail fashion photography with metropolitan luxury shopping district aesthetics",
    "Cozy lifestyle fashion photograph of a soft cardigan draped over a vintage reading chair in a warmly lit living room with books nearby. Natural window light creates a comfortable, homey atmosphere with rich textures. Shot with Sony A7R IV, 50mm f/1.8 lens, shallow depth of field with the room's details softly blurred. Professional lifestyle fashion photography with hygge comfort and authentic home styling"
  ],
  automotive: [
    "Breathtaking automotive photography of a red Ferrari sports car parked on a winding mountain road during golden sunrise. The car's sleek lines and glossy paint reflect the warm morning light perfectly. Shot with Canon EOS R6, 24-70mm f/2.8 lens, the mountain landscape beautifully blurred in the background. Professional automotive photography with cinematic lighting, rich colors, and Motor Trend magazine quality",
    "Classic automotive photograph of a vintage Harley-Davidson motorcycle gleaming in a rustic garage with authentic tools nearby. Warm tungsten lighting creates dramatic shadows and highlights on the chrome and leather details. Captured with Sony A7R IV, 50mm f/1.4 lens, shallow depth of field with the garage tools artistically blurred. Professional motorcycle photography with nostalgic atmosphere and authentic character",
    "Modern automotive photography of a Tesla Model S charging at a sleek urban charging station with contemporary city architecture in the background. Clean lines and modern design elements create a futuristic aesthetic. Shot with Nikon Z7 II, 35mm f/1.8 lens, perfect focus with urban bokeh. Professional electric vehicle photography with clean composition and sustainable technology theme",
    "Rustic automotive photograph of a classic Ford pickup truck parked beside a weathered red barn in golden countryside light. The truck's patina and character contrast beautifully with the pastoral setting. Captured with Canon 5D Mark IV, 85mm f/1.8 lens, shallow depth of field with the barn and fields softly blurred. Professional vintage automotive photography with Americana nostalgia and authentic rural atmosphere",
    "Dynamic automotive photography of a luxury BMW sedan driving through a modern tunnel with dramatic lighting and reflections. The car's elegant silhouette is perfectly captured with motion blur on the tunnel walls. Shot with Sony A9 II, 70-200mm f/2.8 lens, 1/60s shutter speed for controlled motion blur. Professional automotive photography with urban sophistication and luxury car elegance",
    "Epic automotive photography of a luxury convertible cruising along the Pacific Coast Highway with dramatic ocean views and cliffs. The car's elegant profile is captured against the stunning coastal landscape. Shot with Canon EOS R6, 70-200mm f/2.8 lens, panning technique to show motion while keeping the car sharp. Professional automotive photography with California coastal luxury and freedom of the open road",
    "Adventure automotive photograph of a rugged SUV parked at a pristine mountain campsite with snow-capped peaks in the background. The vehicle's capability and outdoor lifestyle are perfectly captured in the wilderness setting. Captured with Sony A7R IV, 24-70mm f/2.8 lens, wide angle to include the dramatic mountain landscape. Professional outdoor vehicle photography with expedition adventure and natural beauty",
    "High-speed motorsports photography of a Formula 1 race car speeding around a professional track with controlled motion blur effects. The car is tack-sharp while the background shows speed lines and track details. Shot with Nikon D6, 300mm f/2.8 lens, 1/60s shutter speed with expert panning technique. Professional racing photography with adrenaline-fueled speed and motorsport precision",
    "Suburban lifestyle automotive photograph of a mountain bike leaning against a family car in a peaceful residential driveway. Morning light creates beautiful shadows and highlights on both vehicles. Captured with Canon 5D Mark IV, 50mm f/1.8 lens, shallow depth of field with the suburban neighborhood softly blurred. Professional lifestyle automotive photography with family adventure and suburban comfort",
    "Motorcycle gear photography of a premium helmet resting on a leather bike seat in an urban parking lot with city architecture in the background. The helmet's reflective surface and leather textures are beautifully lit. Shot with Sony A7R IV, 85mm f/1.4 lens, shallow depth of field with urban bokeh. Professional motorcycle accessory photography with urban riding culture and safety gear aesthetics",
    "Luxury automotive interior photography showcasing a premium car's steering wheel and dashboard bathed in golden sunlight. The leather, wood, and metal details are perfectly illuminated with natural light streaming through the windshield. Shot with Canon EOS R5, 24mm f/1.4 lens, wide angle to capture the full interior design with beautiful light patterns. Professional automotive interior photography with luxury craftsmanship and morning light elegance",
    "Nostalgic automotive photography of a classic 1950s car at a vintage drive-in movie theater under a brilliant starry sky. The car's chrome bumpers reflect the movie screen's glow while stars twinkle above. Captured with Sony A7S III, 35mm f/1.4 lens, long exposure to capture stars with the car lit by ambient theater lighting. Professional vintage automotive photography with Americana nostalgia and cinematic night sky",
    "Adventure automotive photograph of a pickup truck loaded with premium camping gear at a mountain trailhead with wilderness stretching beyond. The truck's rugged capability and outdoor lifestyle equipment are perfectly showcased. Shot with Nikon Z7 II, 24-70mm f/2.8 lens, dramatic mountain landscape with perfect gear organization. Professional outdoor vehicle photography with expedition readiness and wilderness adventure",
    "Artistic urban automotive photography of a sleek sports car perfectly reflected in a rain puddle on a wet city street with neon lights creating colorful reflections. The car's lines are doubled in the reflection creating stunning symmetry. Captured with Canon 5D Mark IV, 50mm f/1.8 lens, low angle to maximize the reflection effect with urban night lighting. Professional street photography with urban sophistication and weather drama",
    "Romantic automotive photography of a classic convertible parked on golden beach sand with ocean waves gently rolling in the background. The car's vintage elegance contrasts beautifully with the natural seascape. Shot with Sony A7R IV, 85mm f/1.8 lens, golden hour lighting with the ocean creating a dreamy backdrop. Professional beach automotive photography with coastal luxury and vintage charm",
    "Urban mobility photography of a modern electric scooter parked beside a trendy sidewalk cafe on a bustling city street with pedestrians and architecture in the background. The scooter represents sustainable urban transportation. Captured with Canon EOS R6, 35mm f/2.8 lens, street photography style with authentic city life. Professional urban transportation photography with eco-friendly mobility and city lifestyle",
    "Spectacular seasonal automotive photography of a car driving through a tunnel of colorful autumn trees with leaves falling around the vehicle. The forest creates a natural cathedral of fall colors. Shot with Nikon D850, 24-70mm f/2.8 lens, 1/60s shutter speed to show subtle motion while keeping the car sharp. Professional landscape automotive photography with seasonal beauty and natural wonder",
    "Scenic automotive photography of a touring motorcycle parked at a dramatic mountain overlook with a vast valley stretching to the horizon. The bike's adventure touring setup is perfectly showcased against the epic landscape. Captured with Sony A9 II, 16-35mm f/2.8 lens, wide angle to capture the full scenic vista. Professional motorcycle travel photography with adventure touring and breathtaking landscapes",
    "Contemporary automotive photography of a hybrid vehicle at a modern gas station with solar panels overhead, representing the transition to sustainable transportation. Clean lines and eco-friendly technology are highlighted. Shot with Canon EOS R5, 50mm f/1.8 lens, architectural composition with sustainable energy elements. Professional automotive photography with environmental consciousness and future mobility",
    "Classic automotive show photography of a pristine antique automobile displayed at an elegant outdoor car show with other vintage vehicles and enthusiasts in the background. The car's restoration and historical significance are perfectly captured. Captured with Nikon Z7 II, 85mm f/1.8 lens, shallow depth of field to isolate the featured vehicle. Professional automotive event photography with collector car culture and historical preservation"
  ],
  art: [
    "Artistic close-up photograph of a paintbrush loaded with vibrant cobalt blue paint on a well-used artist's palette. Natural studio light illuminates the paint's texture and the brush's worn bristles. Shot with Canon EOS R5, 100mm f/2.8 macro lens, extremely shallow depth of field with paint colors beautifully blurred in the background. Professional art photography with rich textures, authentic artist tools, and creative studio atmosphere",
    "Dramatic fine art photograph of a contemporary bronze sculpture casting bold shadows in a modern gallery with natural skylight. The interplay of light and shadow creates stunning geometric patterns on the white walls. Captured with Sony A7R IV, 35mm f/1.4 lens, perfect exposure balancing highlights and shadows. Professional gallery photography with museum quality lighting and architectural composition",
    "Inspiring artist studio photograph of a half-finished oil painting on a wooden easel with paintbrushes and palette nearby. Warm natural light streams through large north-facing windows, illuminating the canvas and creating a creative atmosphere. Shot with Nikon Z7 II, 50mm f/1.8 lens, shallow depth of field with the studio beautifully blurred. Professional art documentation photography with authentic creative process and artistic authenticity",
    "Dynamic pottery photography capturing skilled hands shaping wet clay on a spinning pottery wheel. Water glistens on the clay surface as the artist's hands guide the forming vessel. Captured with Canon 5D Mark IV, 85mm f/1.4 lens, 1/125s shutter speed to show subtle motion while keeping hands sharp. Professional craft photography with authentic artisan process and tactile ceramic art creation",
    "Vibrant urban art photograph of a large colorful mural brightening a weathered brick wall in an artistic neighborhood. The mural's bold colors and intricate details contrast beautifully with the urban texture. Shot with Sony A9 II, 24mm f/2.8 lens, wide angle to capture the mural's full impact. Professional street art photography with rich colors, urban culture, and contemporary artistic expression",
    "Peaceful plein air photography of an artist sketching a portrait in a sun-dappled park under the shade of an ancient oak tree. Natural light filters through leaves creating beautiful patterns on the sketchpad and artist's hands. Shot with Canon EOS R6, 85mm f/1.4 lens, shallow depth of field with the park setting beautifully blurred. Professional art documentation photography with outdoor creativity and natural artistic inspiration",
    "Magnificent architectural photography of a Gothic stained glass window casting brilliant rainbow light patterns across a cathedral floor. The colored light creates a magical carpet of blues, reds, and golds on the stone surface. Captured with Sony A7R IV, 24mm f/2.8 lens, perfect exposure to capture both the window details and floor light patterns. Professional religious architecture photography with spiritual beauty and divine light",
    "Mesmerizing art process photography of watercolor paints mixing and bleeding on textured paper to create a beautiful gradient from deep blue to warm orange. The paint flows naturally creating organic patterns and color transitions. Shot with Canon EOS R5, 100mm f/2.8 macro lens, overhead angle to capture the full paint interaction with perfect color accuracy. Professional art process photography with fluid creativity and color theory",
    "Sculptural art photography of a contemporary metal sculpture gleaming in a serene outdoor garden setting with natural landscaping. The sculpture's polished surface reflects the surrounding plants and sky creating artistic interplay. Captured with Nikon Z7 II, 50mm f/1.8 lens, perfect balance between sculpture detail and garden context. Professional outdoor sculpture photography with modern art and natural environment harmony",
    "Intimate art creation photography of a charcoal drawing slowly emerging on pristine white paper with the artist's hand and charcoal stick visible. The contrast between the dark charcoal marks and white paper creates dramatic artistic tension. Shot with Sony A7R IV, 90mm f/2.8 lens, macro focus on the drawing details with artistic tools softly blurred. Professional drawing documentation photography with creative process and artistic emergence",
    "Intricate craft photography of colorful mosaic tiles being carefully arranged in a complex geometric pattern on a wooden work table. Each tile catches light differently creating a rainbow of colors and textures. Captured with Canon 5D Mark IV, 100mm f/2.8 lens, overhead angle with perfect lighting to show tile details and pattern complexity. Professional mosaic art photography with ancient craft techniques and contemporary artistic vision",
    "Classic studio art photography of a freshly completed oil painting drying on a easel against a white studio wall with artist brushes and palette nearby. Natural north light illuminates the painting's rich colors and thick impasto texture. Shot with Nikon D850, 85mm f/1.8 lens, shallow depth of field focusing on the painting with studio tools artistically blurred. Professional fine art documentation photography with traditional painting techniques",
    "Elegant calligraphy photography of a fountain pen creating flowing elegant letters on aged parchment paper with ink bottle and blotter nearby. The pen's gold nib catches light as it forms beautiful letterforms. Captured with Canon EOS R5, 100mm f/2.8 macro lens, perfect focus on the pen tip and fresh ink with warm lighting. Professional calligraphy art photography with traditional writing arts and elegant typography",
    "Contemporary gallery photography of a bold abstract painting with vibrant colors and dynamic brushstrokes hanging in a modern white gallery space with perfect museum lighting. The painting's energy contrasts beautifully with the minimal gallery architecture. Shot with Sony A7R IV, 35mm f/2.8 lens, architectural composition balancing artwork and space. Professional gallery documentation photography with contemporary art and museum presentation",
    "Inspiring artist studio photography of a working art studio filled with canvases, easels, and art supplies with beautiful natural light streaming through large north-facing windows. The creative chaos and artistic tools create an authentic creative environment. Captured with Canon EOS R6, 24mm f/1.4 lens, wide angle to capture the full studio atmosphere with natural lighting. Professional studio documentation photography with artistic workspace and creative environment",
    "Delicate craft photography of skilled hands painting intricate floral designs on a ceramic vase with fine brushes and porcelain paints. The artist's precision and the vase's elegant form are captured in perfect detail. Shot with Nikon Z7 II, 105mm f/2.8 macro lens, perfect focus on the brush and paint details with artistic concentration. Professional ceramic art photography with traditional pottery decoration and artisan craftsmanship",
    "Dynamic street art photography of a graffiti artist creating a large colorful mural on an urban brick wall with spray cans and artistic energy. The work in progress shows bold colors and creative expression in an authentic urban setting. Captured with Sony A9 II, 35mm f/1.4 lens, environmental portrait style showing both artist and artwork. Professional street art documentation photography with urban culture and contemporary artistic expression",
    "Nostalgic photography darkroom scene with black and white prints hanging on lines to dry with red safelight creating atmospheric mood. The traditional photographic process and chemical trays create authentic darkroom atmosphere. Shot with Canon 5D Mark IV, 50mm f/1.8 lens, available light photography with red safelight for authentic mood. Professional photographic process documentation with analog photography and traditional darkroom techniques",
    "Traditional textile art photography of a wooden weaving loom with colorful threads creating an intricate tapestry pattern. The warp and weft threads create beautiful geometric patterns and rich color combinations. Captured with Nikon D850, 85mm f/1.8 lens, perfect focus on thread details with beautiful textile textures. Professional textile art photography with traditional weaving techniques and fiber arts craftsmanship",
    "Dramatic glass art photography of a master glass blower shaping molten glass with traditional tools in a hot shop with furnace glow creating atmospheric lighting. The artist's skill and the glass's fluid form are captured at the perfect moment. Shot with Sony A7S III, 85mm f/1.4 lens, fast shutter to freeze the action with furnace lighting. Professional glass art documentation photography with ancient craft techniques and molten glass artistry"
  ],
  science: [
    "Stunning scientific photography of a high-powered microscope revealing vibrant cellular structures on a laboratory slide with brilliant colors and intricate detail. The microscope's precision optics capture the hidden beauty of biological life. Shot with Canon EOS R5, 100mm f/2.8 macro lens adapted to microscope eyepiece, perfect focus on cellular structures with scientific accuracy. Professional scientific photography with biological research and microscopic beauty",
    "Colorful laboratory photography of precision test tubes containing various chemical solutions in bright blues, greens, and yellows arranged in a modern research lab. The solutions' clarity and color create beautiful scientific compositions. Captured with Sony A7R IV, 85mm f/1.8 lens, perfect lighting to show solution clarity and lab equipment details. Professional chemistry photography with research laboratory and chemical analysis aesthetics",
    "Magnificent astrophotography of a professional telescope pointed toward a brilliant starry night sky from a rooftop observatory. The Milky Way stretches across the sky while the telescope tracks celestial objects. Shot with Nikon D850, 14mm f/2.8 lens, long exposure to capture star trails and telescope silhouette. Professional astronomical photography with space exploration and celestial observation",
    "Scientific visualization photography of an illuminated DNA double helix model rotating in soft laboratory lighting with perfect helical structure visible. The model's elegant form demonstrates the beauty of genetic architecture. Captured with Canon 5D Mark IV, 100mm f/2.8 lens, controlled studio lighting to highlight the helix structure with scientific precision. Professional molecular biology photography with genetic research and structural beauty",
    "Dynamic chemistry photography of glass beakers bubbling with active chemical reactions on a modern laboratory bench with colorful solutions and precise scientific equipment. Steam and bubbles show active chemical processes. Shot with Sony A9 II, 50mm f/1.8 lens, fast shutter to capture bubble formation with perfect chemical reaction documentation. Professional analytical chemistry photography with laboratory research and chemical processes",
    "Sustainable technology photography of gleaming solar panels arranged on a modern rooftop against a brilliant blue sky with white clouds. The panels' geometric patterns and reflective surfaces create stunning visual compositions. Captured with Canon EOS R6, 24-70mm f/2.8 lens, polarizing filter to enhance sky contrast and panel reflections. Professional renewable energy photography with sustainable technology and environmental innovation",
    "Scientific research photography of a botanist carefully examining plant specimens in a lush greenhouse environment filled with exotic plants and natural light. The researcher's precision and plant diversity create authentic scientific atmosphere. Shot with Sony A7R IV, 85mm f/1.8 lens, natural greenhouse lighting with perfect focus on research activity. Professional botanical research photography with plant science and greenhouse research environment",
    "High-tech scientific photography of multiple computer screens displaying complex colorful data visualizations, graphs, and scientific models in a modern research facility. The screens glow with scientific data and analysis results. Captured with Nikon Z7 II, 35mm f/1.4 lens, balanced exposure for screen details and ambient lab lighting. Professional data science photography with computational research and scientific visualization",
    "Precision scientific photography of analytical laboratory scales measuring exact amounts of chemical substances with perfect accuracy and digital readouts. The scales' precision and scientific measurement create authentic research atmosphere. Shot with Canon 5D Mark IV, 100mm f/2.8 macro lens, perfect focus on scale details and measurement precision. Professional analytical chemistry photography with laboratory precision and scientific measurement",
    "Fascinating microbiology photography of colorful bacterial cultures growing in Petri dishes under controlled laboratory lighting with vibrant colonies and growth patterns. The bacterial growth creates beautiful natural art forms. Captured with Sony A7R IV, 90mm f/2.8 macro lens, perfect lighting to show colony colors and growth patterns. Professional microbiology photography with bacterial cultures and laboratory research",
    "Atmospheric meteorology photography of a weather balloon floating high above dramatic cloud formations with scientific instruments attached for atmospheric research. The balloon contrasts beautifully against the sky and clouds. Shot with Nikon D850, 70-200mm f/2.8 lens, telephoto compression to show balloon against cloud formations. Professional atmospheric research photography with meteorological science and weather monitoring",
    "Scientific instrument photography of a seismograph actively recording earthquake activity with the needle tracing seismic waves on paper rolls. The instrument's precision and earthquake data create fascinating scientific documentation. Captured with Canon EOS R5, 50mm f/1.8 lens, perfect focus on the recording mechanism and seismic traces. Professional seismology photography with earthquake monitoring and geological research",
    "Optical physics photography of a glass prism splitting white light into a brilliant rainbow spectrum with perfect color separation and optical precision. The prism demonstrates fundamental physics principles beautifully. Shot with Sony A9 II, 100mm f/2.8 macro lens, controlled lighting to show perfect spectrum separation and optical effects. Professional physics photography with optical science and light spectrum analysis",
    "Academic research photography of a laboratory notebook filled with detailed handwritten scientific observations, equations, and research notes with fountain pen nearby. The notebook shows authentic scientific methodology and research documentation. Captured with Canon 5D Mark IV, 85mm f/1.8 lens, natural lighting to show handwriting details and scientific notation. Professional research documentation photography with scientific methodology and academic research",
    "Advanced robotics photography of a precision robotic arm conducting automated scientific experiments with perfect mechanical movements and laboratory integration. The robot's precision and laboratory setting demonstrate advanced scientific automation. Shot with Nikon Z7 II, 24-70mm f/2.8 lens, industrial lighting to show robotic precision and laboratory environment. Professional robotics photography with laboratory automation and scientific precision",
    "Paleontology photography of a perfectly preserved fossil embedded in sedimentary rock being carefully excavated with precision tools and archaeological methodology. The fossil's detail and excavation process show scientific discovery. Captured with Sony A7R IV, 105mm f/2.8 macro lens, perfect focus on fossil details and excavation tools. Professional paleontology photography with fossil excavation and geological research",
    "High-tech laboratory photography of scientists working in a sterile clean room environment wearing protective white suits with advanced equipment and controlled atmosphere. The clean room's precision and scientific protocols create futuristic atmosphere. Shot with Canon EOS R6, 35mm f/2.8 lens, clean room lighting to show sterile environment and scientific precision. Professional clean room photography with advanced research and scientific protocols",
    "Impressive physics photography of a particle accelerator tunnel stretching into the distance with sophisticated scientific equipment and precise engineering. The tunnel's scale and complexity demonstrate advanced physics research. Captured with Nikon D850, 14mm f/2.8 lens, wide angle to show tunnel perspective and scientific equipment scale. Professional particle physics photography with advanced research facilities and scientific engineering",
    "Medical imaging photography of advanced medical scanners displaying detailed brain imagery with colorful diagnostic information and precise medical data. The scanner's sophistication and brain imaging demonstrate medical technology advancement. Shot with Sony A7S III, 50mm f/1.8 lens, balanced exposure for screen details and medical equipment. Professional medical imaging photography with diagnostic technology and healthcare innovation",
    "Environmental research photography of a field scientist collecting water samples from a pristine mountain stream with scientific equipment and natural research environment. The researcher's methodology and natural setting show environmental science in action. Captured with Canon EOS R5, 24-70mm f/2.8 lens, natural lighting to show research activity and pristine environment. Professional environmental science photography with field research and ecological studies"
  ],
  education: [
    "Academic still life photography of an open textbook on a polished wooden desk with sharpened pencils, highlighters, and reading glasses nearby in warm natural light. The scene captures the essence of dedicated study and learning. Shot with Canon EOS R5, 85mm f/1.8 lens, shallow depth of field with perfect focus on text and study materials. Professional educational photography with academic excellence and scholarly dedication",
    "Classic classroom photography of a traditional blackboard covered with complex mathematical equations written in white chalk with perfect penmanship and academic precision. The equations demonstrate advanced mathematical concepts and educational achievement. Captured with Sony A7R IV, 50mm f/1.8 lens, even lighting to show chalk details and mathematical notation clearly. Professional mathematics education photography with academic rigor and intellectual achievement",
    "Inspiring outdoor education photography of diverse students sitting in a circle on green grass reading books under the shade of large trees with natural learning environment. The scene shows collaborative learning and educational engagement. Shot with Nikon Z7 II, 35mm f/2.8 lens, natural lighting to capture authentic student interaction and outdoor classroom atmosphere. Professional alternative education photography with collaborative learning and natural classroom settings",
    "Magnificent library photography of towering bookshelves filled with thousands of colorful books reaching toward the ceiling with warm lighting and architectural grandeur. The library's scale and book collection demonstrate knowledge preservation and academic resources. Captured with Canon 5D Mark IV, 24mm f/1.4 lens, wide angle to show library scale and architectural beauty. Professional academic library photography with knowledge preservation and educational resources",
    "Ceremonial graduation photography of a cap and diploma lying on a wooden table in golden sunlight with university insignia and academic honors visible. The scene captures educational achievement and academic success. Shot with Sony A9 II, 100mm f/2.8 lens, macro focus on diploma details with warm celebratory lighting. Professional graduation photography with academic achievement and educational milestone celebration",
    "Engaging classroom photography of enthusiastic children raising their hands eagerly in a bright, modern classroom with natural light streaming through large windows. Their faces show genuine excitement for learning and academic engagement. Shot with Canon EOS R6, 50mm f/1.8 lens, natural classroom lighting to capture authentic student enthusiasm and educational environment. Professional education photography with student engagement and classroom dynamics",
    "Academic organization photography of a neat stack of colorful notebooks tied with a red ribbon sitting on a teacher's wooden desk with lesson plans and teaching materials nearby. The scene shows educational preparation and academic organization. Captured with Sony A7R IV, 85mm f/1.4 lens, shallow depth of field with warm desk lighting. Professional teaching photography with educational materials and academic preparation",
    "Technology education photography of students collaborating in a modern computer lab learning coding together with multiple screens showing programming languages and collaborative learning. The lab buzzes with technological education and digital literacy. Shot with Nikon Z7 II, 35mm f/2.8 lens, balanced lighting for screens and student interaction. Professional STEM education photography with technology learning and digital skills development",
    "Science education photography of an impressive science fair project display featuring a detailed volcano model with scientific explanations, charts, and student research documentation. The project demonstrates hands-on scientific learning and student achievement. Captured with Canon 5D Mark IV, 50mm f/1.8 lens, even lighting to show project details and scientific methodology. Professional science education photography with student research and hands-on learning",
    "Creative education photography of art students painting at wooden easels positioned near large windows with natural north light illuminating their canvases and creative work. The studio atmosphere encourages artistic expression and creative learning. Shot with Sony A9 II, 85mm f/1.8 lens, natural lighting to show artistic process and creative education environment. Professional art education photography with creative expression and artistic learning",
    "Joyful education photography of children playing actively during recess on a school playground with swings, slides, and playground equipment under clear blue skies. The scene captures childhood joy and physical education through play. Captured with Canon EOS R5, 24-70mm f/2.8 lens, fast shutter to freeze action with bright outdoor lighting. Professional school photography with childhood development and physical education",
    "Dedicated education photography of a teacher writing detailed lesson plans at a wooden desk in an empty classroom with educational posters, books, and teaching materials surrounding the workspace. The scene shows educational dedication and teaching preparation. Shot with Nikon D850, 50mm f/1.4 lens, warm desk lighting to create intimate teaching preparation atmosphere. Professional teaching photography with educational planning and teacher dedication",
    "Academic architecture photography of a grand university lecture hall with rows of polished wooden seats arranged in perfect tiers facing a large presentation area with classical academic architecture. The hall embodies higher education tradition and academic excellence. Captured with Sony A7R IV, 24mm f/2.8 lens, architectural lighting to show scale and academic grandeur. Professional university photography with higher education and academic tradition",
    "Contemplative education photography of a focused student studying alone in a quiet corner of a library with books, notebooks, and warm reading lamp creating a peaceful study environment. The scene captures dedicated academic focus and independent learning. Shot with Canon EOS R6, 85mm f/1.8 lens, natural library lighting with intimate study atmosphere. Professional academic photography with independent study and scholarly dedication",
    "Collaborative education photography of diverse students gathered around a modern conference table in a bright collaborative workspace with laptops, notebooks, and project materials for group learning. The space encourages teamwork and collaborative problem-solving. Captured with Nikon Z7 II, 35mm f/2.8 lens, natural lighting to show group dynamics and collaborative learning. Professional education photography with teamwork and collaborative learning environments",
    "Laboratory education photography of students wearing safety goggles and conducting safe chemistry experiments with beakers, test tubes, and scientific equipment in a well-equipped school laboratory. The scene shows hands-on science education and laboratory safety protocols. Shot with Sony A7R IV, 50mm f/1.8 lens, laboratory lighting to show experimental setup and student safety. Professional science education photography with laboratory learning and scientific methodology",
    "Music education photography of a school music room with various instruments including piano, guitars, drums, and band instruments carefully arranged with sheet music stands and educational materials. The room inspires musical learning and creative expression. Captured with Canon 5D Mark IV, 35mm f/2.8 lens, even lighting to show instrument details and music education environment. Professional music education photography with musical instruments and creative learning",
    "Early childhood education photography of a bright kindergarten classroom filled with colorful learning materials, educational toys, alphabet charts, and child-sized furniture creating an engaging learning environment for young children. The space encourages early childhood development and foundational learning. Shot with Canon EOS R5, 24mm f/1.4 lens, bright natural lighting to show colorful educational environment. Professional early education photography with childhood development and foundational learning",
    "Modern education photography of a well-organized home learning setup with laptop, notebooks, pens, and educational materials arranged on a wooden desk near a window with natural light for online learning. The setup shows adaptation to digital education and remote learning success. Captured with Sony A9 II, 50mm f/1.8 lens, natural window lighting to show home study organization. Professional remote education photography with digital learning and home education environments",
    "Transportation education photography of a classic yellow school bus parked outside a traditional red brick elementary school building with American flag and school signage visible. The scene represents traditional American public education and school transportation. Shot with Nikon D850, 35mm f/2.8 lens, natural outdoor lighting to show school architecture and educational transportation. Professional school photography with educational infrastructure and school transportation systems"
  ],
  healthcare: [
    "Professional medical photography of a stethoscope resting on detailed medical charts in a doctor's office with warm natural light illuminating the medical documents and diagnostic equipment. The scene represents medical expertise and patient care documentation. Shot with Canon EOS R5, 100mm f/2.8 lens, shallow depth of field focusing on stethoscope with medical charts softly blurred. Professional medical photography with healthcare documentation and medical practice",
    "Serene healthcare photography of a modern hospital room with a comfortable patient bed positioned near large windows allowing natural light to create a healing environment with medical equipment discretely integrated. The room balances medical functionality with patient comfort. Captured with Sony A7R IV, 35mm f/2.8 lens, natural lighting to show healing environment and patient care facilities. Professional hospital photography with patient comfort and healing environments",
    "Compassionate healthcare photography of a caring nurse checking patient vital signs with a gentle, professional expression while using modern medical monitoring equipment in a bright patient room. The interaction shows healthcare compassion and professional medical care. Shot with Nikon Z7 II, 85mm f/1.8 lens, natural lighting to capture authentic caregiver-patient interaction. Professional nursing photography with patient care and medical compassion",
    "Advanced medical technology photography of sophisticated monitoring equipment displaying heart rhythm patterns, vital signs, and medical data on high-resolution screens with precise medical measurements and patient monitoring capabilities. The equipment demonstrates modern healthcare technology. Captured with Canon 5D Mark IV, 50mm f/1.8 lens, balanced lighting for screen details and medical equipment. Professional medical technology photography with patient monitoring and healthcare innovation",
    "Organized pharmacy photography of well-arranged medication shelves with various pharmaceutical bottles, prescription containers, and medical supplies organized systematically in a modern pharmacy setting with proper lighting and professional organization. The pharmacy represents medication management and pharmaceutical care. Shot with Sony A9 II, 35mm f/2.8 lens, even lighting to show pharmaceutical organization and medication management. Professional pharmacy photography with pharmaceutical care and medication safety",
    "Medical hygiene photography of a healthcare professional thoroughly washing hands at a medical sink with proper technique, soap dispensers, and sterile protocols visible, demonstrating infection control and medical safety procedures. The scene emphasizes healthcare safety and infection prevention. Captured with Canon EOS R6, 85mm f/1.8 lens, clinical lighting to show proper medical hygiene procedures. Professional medical safety photography with infection control and healthcare protocols",
    "Emergency medical photography of a modern ambulance parked outside a hospital emergency entrance with medical equipment visible and emergency lighting creating an atmosphere of medical readiness and emergency healthcare response. The ambulance represents emergency medical services and rapid patient care. Shot with Nikon D850, 24-70mm f/2.8 lens, natural lighting with emergency vehicle details. Professional emergency medical photography with emergency services and rapid response healthcare",
    "Rehabilitation healthcare photography of a physical therapist professionally assisting a patient with walking exercises using parallel bars and therapeutic equipment in a bright rehabilitation facility with encouraging atmosphere. The scene shows recovery and therapeutic healthcare. Captured with Sony A7R IV, 50mm f/1.8 lens, natural lighting to show therapeutic interaction and rehabilitation progress. Professional physical therapy photography with patient rehabilitation and therapeutic care",
    "Medical imaging photography of an advanced medical scanner prepared for patient examination with sophisticated diagnostic equipment, computer monitors, and sterile medical environment ready for diagnostic procedures. The scanner represents modern diagnostic healthcare technology. Shot with Canon 5D Mark IV, 35mm f/2.8 lens, clinical lighting to show advanced medical equipment and diagnostic capabilities. Professional medical imaging photography with diagnostic technology and advanced healthcare",
    "Sterile medical photography of precision surgical instruments arranged methodically on a sterile surgical tray with perfect organization, surgical lighting, and operating room protocols demonstrating surgical preparation and medical precision. The instruments represent surgical expertise and medical precision. Captured with Sony A7R IV, 100mm f/2.8 macro lens, surgical lighting to show instrument details and sterile procedures. Professional surgical photography with medical precision and surgical preparation",
    "Comfortable healthcare photography of a modern medical waiting room with ergonomic seating, calming artwork, natural lighting, and peaceful atmosphere designed to reduce patient anxiety and create a welcoming healthcare environment. The space prioritizes patient comfort and emotional well-being. Shot with Canon EOS R5, 24mm f/1.4 lens, natural lighting to show comfortable healthcare environment and patient-centered design. Professional healthcare facility photography with patient comfort and healing environments",
    "Medical procedure photography of a blood pressure cuff properly positioned on a patient's arm with digital monitoring equipment displaying accurate readings and healthcare professional conducting the measurement with proper medical technique. The scene demonstrates routine medical care and vital sign monitoring. Captured with Nikon Z7 II, 85mm f/1.8 lens, clinical lighting to show medical procedure and patient care. Professional medical procedure photography with vital sign monitoring and routine healthcare",
    "Laboratory healthcare photography of a medical technician examining patient samples using microscopes, laboratory equipment, and diagnostic tools in a modern medical laboratory with proper lighting and scientific protocols. The lab represents diagnostic medicine and laboratory analysis. Shot with Sony A9 II, 50mm f/1.8 lens, laboratory lighting to show scientific analysis and diagnostic procedures. Professional medical laboratory photography with diagnostic testing and laboratory medicine",
    "Healthcare facility photography of a clean, bright hospital hallway with polished floors, modern lighting, directional signage, and medical equipment creating a professional healthcare environment that prioritizes cleanliness and patient navigation. The hallway represents healthcare facility management and patient care infrastructure. Captured with Canon EOS R6, 35mm f/2.8 lens, architectural lighting to show healthcare facility design and medical infrastructure. Professional hospital photography with healthcare facilities and medical environments",
    "Medical consultation photography of a doctor explaining treatment options to patients using visual aids, medical charts, and educational materials in a comfortable consultation room with natural lighting and professional medical communication. The consultation demonstrates patient education and informed medical decision-making. Shot with Nikon D850, 50mm f/1.4 lens, natural lighting to show doctor-patient communication and medical consultation. Professional medical consultation photography with patient education and healthcare communication",
    "Wellness healthcare photography of a peaceful wellness center with yoga mats, meditation cushions, natural lighting, and calming atmosphere designed for holistic health, stress reduction, and wellness programs. The center represents preventive healthcare and wellness medicine. Captured with Sony A7R IV, 35mm f/2.8 lens, natural lighting to show wellness environment and holistic healthcare. Professional wellness photography with preventive medicine and holistic health approaches",
    "Advanced medical research photography of a sophisticated medical research facility with cutting-edge laboratory equipment, research stations, and scientific instruments used for medical breakthroughs and healthcare innovation. The facility represents medical research and scientific advancement. Shot with Canon 5D Mark IV, 24-70mm f/2.8 lens, laboratory lighting to show research equipment and scientific innovation. Professional medical research photography with healthcare research and scientific advancement",
    "Emergency healthcare photography of a fully equipped emergency room prepared for incoming patient care with medical equipment, monitoring devices, and emergency medical supplies organized for rapid patient treatment and critical care. The ER represents emergency medicine and critical healthcare services. Captured with Sony A9 II, 35mm f/2.8 lens, emergency room lighting to show medical readiness and critical care capabilities. Professional emergency medicine photography with critical care and emergency healthcare",
    "Therapeutic healthcare photography of a modern rehabilitation gym with specialized exercise equipment, parallel bars, therapy mats, and physical therapists working with patients to restore mobility and strength. The gym represents recovery medicine and therapeutic rehabilitation. Shot with Canon EOS R5, 50mm f/1.8 lens, natural lighting to show rehabilitation equipment and therapeutic exercise. Professional rehabilitation photography with physical therapy and recovery medicine",
    "Medical consultation photography of a well-appointed medical consultation room set up for patient visits with examination table, medical equipment, comfortable seating, and professional medical environment designed for patient care and medical examinations. The room represents primary healthcare and patient-centered medical practice. Captured with Nikon Z7 II, 35mm f/2.8 lens, medical lighting to show consultation room setup and patient care environment. Professional medical practice photography with patient care and medical consultation facilities"
  ],
  music: [
    "Majestic concert hall photography of a grand piano's polished keys gleaming under dramatic concert hall spotlights with the elegant instrument positioned center stage for a classical performance. The piano's ebony and ivory keys reflect the stage lighting beautifully. Shot with Canon EOS R5, 85mm f/1.8 lens, theatrical lighting to capture piano elegance and concert hall grandeur. Professional classical music photography with concert performance and musical excellence",
    "Intimate music photography of a well-worn acoustic guitar leaning gracefully against a vintage leather chair in a cozy room with warm natural light streaming through windows and musical sheets nearby. The guitar shows authentic character from years of musical expression. Captured with Sony A7R IV, 50mm f/1.4 lens, natural lighting to show guitar character and intimate music space. Professional acoustic music photography with folk music and intimate musical settings",
    "Elegant classical music photography of a pristine violin resting in its luxurious velvet-lined case alongside its bow with perfect craftsmanship and musical instrument artistry visible in every detail. The violin represents centuries of musical tradition and craftsmanship. Shot with Canon 5D Mark IV, 100mm f/2.8 macro lens, soft lighting to show violin craftsmanship and classical instrument beauty. Professional string instrument photography with classical music and musical craftsmanship",
    "Dynamic percussion photography of a complete drum set positioned on a concert stage with professional microphones positioned for optimal sound capture and stage lighting creating dramatic shadows and highlights on the drum surfaces. The setup represents live music performance energy. Captured with Nikon Z7 II, 35mm f/2.8 lens, stage lighting to show drum kit and live performance setup. Professional percussion photography with live music and concert performance",
    "Musical composition photography of handwritten sheet music scattered across a polished piano bench with a well-used pencil, music notation, and composer's notes showing the creative process of musical composition and arrangement. The scene captures musical creativity and composition process. Shot with Sony A9 II, 85mm f/1.8 lens, natural lighting to show musical notation and composition details. Professional music composition photography with musical creation and songwriting process",
    "Professional music production photography of a state-of-the-art recording studio with soundproof walls, mixing boards, studio monitors, and professional audio equipment arranged for optimal sound recording and music production. The studio represents modern music creation and audio engineering. Captured with Canon EOS R6, 24-70mm f/2.8 lens, studio lighting to show professional audio equipment and recording environment. Professional recording studio photography with music production and audio engineering",
    "Concert performance photography of a professional microphone standing ready on an empty concert stage with dramatic stage lighting, sound equipment, and performance space prepared for live musical performance. The microphone awaits the artist's voice and musical expression. Shot with Nikon D850, 50mm f/1.8 lens, stage lighting to create dramatic concert atmosphere and performance anticipation. Professional concert photography with live music performance and stage presence",
    "Music production photography of premium studio headphones hanging on a professional hook in a modern music production room with mixing equipment, audio interfaces, and digital audio workstations visible in the background. The headphones represent critical listening and audio precision. Captured with Sony A7R IV, 85mm f/1.4 lens, studio lighting to show audio equipment and music production environment. Professional audio production photography with sound engineering and music creation",
    "Jazz music photography of a golden saxophone gleaming under warm jazz club lighting with atmospheric mood, intimate venue setting, and musical instruments creating the perfect jazz performance environment. The saxophone represents jazz musical tradition and improvisation. Shot with Canon 5D Mark IV, 85mm f/1.2 lens, jazz club lighting to capture saxophone beauty and intimate jazz atmosphere. Professional jazz photography with jazz music culture and musical improvisation",
    "Rock music photography of an electric guitar plugged into a vintage amplifier in an authentic garage band setting with musical equipment, band posters, and rock music atmosphere showing grassroots musical creativity and rock culture. The setup represents rock music origins and garage band spirit. Captured with Sony A9 II, 35mm f/1.4 lens, natural garage lighting to show rock music authenticity and musical rebellion. Professional rock music photography with garage band culture and electric music",
    "Orchestra photography of a symphony orchestra pit filled with various classical instruments including strings, brass, woodwinds, and percussion arranged precisely before a concert performance with musicians' chairs and music stands prepared. The orchestra represents classical music ensemble and musical collaboration. Shot with Canon EOS R5, 24mm f/1.4 lens, concert hall lighting to show orchestral arrangement and classical music preparation. Professional orchestral photography with symphony music and ensemble performance",
    "Abstract music photography of musical notes appearing to float through the air in an artistic, animated style with motion blur, creative lighting, and visual representation of music's ethereal nature and sound waves. The image captures music's invisible beauty and auditory art form. Captured with Nikon Z7 II, 85mm f/1.8 lens, creative lighting and motion effects to visualize music and sound. Professional abstract music photography with musical visualization and artistic interpretation",
    "Vinyl music photography of a vintage turntable spinning a classic vinyl record with the needle positioned perfectly on the groove, capturing the analog music experience and vinyl record culture with authentic turntable equipment. The turntable represents analog music reproduction and vinyl collecting culture. Shot with Sony A7R IV, 100mm f/2.8 macro lens, warm lighting to show turntable details and vinyl texture. Professional vinyl photography with analog music and record collecting culture",
    "Sacred music photography of a traditional church choir loft with wooden pews, organ pipes, hymnal books, and religious musical instruments arranged for worship music and congregational singing in a beautiful sanctuary setting. The loft represents sacred music tradition and spiritual musical expression. Captured with Canon 5D Mark IV, 35mm f/2.8 lens, church lighting to show sacred music environment and religious musical tradition. Professional sacred music photography with church music and spiritual musical expression",
    "Tropical music photography of a ukulele sitting casually on a colorful beach towel beside rolling ocean waves with sand, seashells, and coastal atmosphere creating a relaxed island music vibe and beach musical culture. The ukulele represents island music tradition and casual musical expression. Shot with Nikon D850, 50mm f/1.8 lens, natural beach lighting to show tropical music setting and island musical culture. Professional tropical music photography with beach music and island musical traditions",
    "Marching band photography of a brass trumpet reflecting bright stage lights in a marching band formation with uniformed musicians, band instruments, and performance precision showing musical discipline and ensemble coordination. The trumpet represents brass music excellence and marching band tradition. Captured with Sony A9 II, 70-200mm f/2.8 lens, performance lighting to show brass instrument detail and marching band precision. Professional marching band photography with brass music and musical ensemble performance",
    "Music education photography of a piano teacher and student sitting together at a piano bench during a lesson with sheet music, piano keys, and educational musical interaction showing music learning and pedagogical musical instruction. The scene represents music education and musical mentorship. Shot with Canon EOS R6, 85mm f/1.8 lens, natural lighting to show music lesson interaction and educational musical environment. Professional music education photography with piano instruction and musical learning",
    "Music festival photography of a large outdoor concert stage with colorful stage lights, powerful speaker systems, and festival atmosphere prepared for live music performance with crowd barriers and festival infrastructure visible. The stage represents live music culture and festival entertainment. Captured with Nikon Z7 II, 24-70mm f/2.8 lens, festival lighting to show concert stage scale and live music infrastructure. Professional music festival photography with concert performance and live music entertainment",
    "Classical music photography of an elegant cello leaning against a wall in a quiet practice room with sheet music, music stand, and peaceful musical practice environment showing string instrument beauty and musical solitude. The cello represents classical string music and individual musical practice. Shot with Sony A7R IV, 85mm f/1.4 lens, natural lighting to show cello craftsmanship and practice room atmosphere. Professional string instrument photography with classical music and musical practice",
    "Street music photography of a talented street musician playing acoustic guitar with an open guitar case for tips, showing authentic street performance, musical busking culture, and public musical expression in an urban setting. The musician represents grassroots music culture and public musical performance. Captured with Canon 5D Mark IV, 50mm f/1.8 lens, natural street lighting to show street music authenticity and urban musical culture. Professional street music photography with busking culture and public musical performance"
  ],
  anime: [
    "Beautiful anime cityscape view of a bustling metropolis at sunset with towering skyscrapers, neon signs, and busy streets filled with people. Cartoon anime art style with warm golden lighting, detailed city architecture, and vibrant urban atmosphere",
    "Stunning anime city view from a high rooftop showing a futuristic skyline with flying cars, holographic billboards, and glowing buildings against a starry night sky. Cyberpunk anime art style with neon colors and sci-fi city design",
    "Charming anime cityscape of a traditional Japanese town with wooden buildings, cherry blossom trees, and lantern-lit streets during evening. Studio Ghibli-inspired anime art style with soft colors and nostalgic atmosphere",
    "Epic anime city view of a fantasy metropolis with floating islands, magical towers, and bridges connecting different districts. Fantasy anime art style with mystical lighting and imaginative architecture",
    "Trendy anime character with modern street fashion - a cool teenager with dyed blue hair, oversized hoodie, and stylish sneakers, standing in a neon-lit urban setting. Contemporary anime art style with vibrant colors and dynamic lighting",
    "Kawaii anime girl with pastel pink hair in twin buns, wearing a cute lolita dress with frills and bows, holding a plush toy in a pastel-colored room. Modern anime art style with soft lighting and adorable character design",
    "Badass anime character with silver hair and cyberpunk outfit, wearing a leather jacket with glowing LED accents, standing in a futuristic cityscape. High-quality anime art with neon lighting and detailed character design",
    "Trendy anime boy with messy black hair and casual streetwear, wearing a graphic t-shirt and ripped jeans, sitting in a trendy cafe with latte art. Modern slice-of-life anime style with warm lighting and relatable character design",
    "Anime character with rainbow-colored hair and gothic lolita fashion, wearing a black and white dress with lace details, standing in a gothic cathedral setting. Dark fantasy anime art style with dramatic lighting and intricate character design",
    "Cool anime character with spiky red hair and sports uniform, wearing a basketball jersey and sneakers, mid-action pose on a court. Dynamic sports anime style with motion lines and energetic character design",
    "Trendy anime girl with long purple hair and modern kawaii fashion, wearing a crop top and high-waisted shorts, posing in a colorful bedroom with LED lights. Contemporary anime art with vibrant colors and social media-ready aesthetics",
    "Anime character with white hair and elegant formal wear, wearing a tailored suit with subtle accessories, standing in a modern office setting. Professional anime art style with clean lines and sophisticated character design",
    "Cute anime character with short brown hair and casual summer outfit, wearing a sundress and sandals, walking through a flower garden. Wholesome anime art style with natural lighting and cheerful character design",
    "Trendy anime character with multicolored hair and alternative fashion, wearing a punk-style outfit with chains and studs, standing in a music venue. Edgy anime art style with dramatic lighting and rebellious character design",
    "Anime character with long silver hair and fantasy outfit, wearing a flowing robe with magical accessories, standing in a mystical forest. Fantasy anime art style with ethereal lighting and magical character design",
    "Modern anime character with short pink hair and techwear outfit, wearing a futuristic jacket with digital displays, standing in a high-tech environment. Sci-fi anime art style with neon lighting and cyberpunk aesthetics",
    "Trendy anime character with curly orange hair and vintage fashion, wearing a retro outfit with classic accessories, posing in a nostalgic setting. Vintage anime art style with warm colors and timeless character design",
    "Anime character with long black hair and elegant kimono, wearing traditional Japanese clothing with modern touches, standing in a traditional garden. Cultural anime art style with natural lighting and refined character design",
    "Cool anime character with spiky blonde hair and casual streetwear, wearing a hoodie and joggers, sitting on a rooftop with city view. Urban anime art style with cityscape background and relaxed character design",
    "Trendy anime character with short blue hair and sporty outfit, wearing athletic wear with brand logos, mid-workout pose in a modern gym. Fitness anime art style with dynamic poses and energetic character design"
  ],
  aesthetic: [
    "Natural realistic photo: Flat lay of coffee cup, notebook, and iPad on pastel pink background, minimal aesthetic, soft shadows. Captured with Sony A7R V, 50mm lens, f/2.8, soft natural light, high-resolution, lifestyle photography, clean composition. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Santorini rooftops at sunset, pastel watercolor painting, warm soft tones. Captured with Canon EOS R5, 24-70mm lens, f/8, golden hour light, high-resolution, travel photography, dreamy atmosphere. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimal coffee cup on white marble table, soft natural morning light, clean background. Captured with Nikon Z7 II, 85mm lens, f/2.8, shallow depth of field, high-resolution, minimalist photography, elegant simplicity. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Pink and lavender pastel clouds in blue sky, minimal dreamy aesthetic. Captured with Sony A7R IV, 35mm lens, f/5.6, soft natural light, high-resolution, sky photography, serene atmosphere. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimal beach with pastel ocean waves and gradient sky, serene atmosphere. Captured with Canon 5D Mark IV, 24mm lens, f/8, soft natural light, high-resolution, coastal photography, peaceful mood. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: MacBook on wooden desk, pastel accessories, soft morning sunlight, minimal setup. Captured with Sony A7R V, 50mm lens, f/2.8, natural window light, high-resolution, workspace photography, clean aesthetic. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: City skyline at sunset, pastel gradient sky, watercolor minimal aesthetic. Captured with Nikon Z7 II, 70-200mm lens, f/8, golden hour light, high-resolution, urban photography, dreamy atmosphere. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Scandinavian living room, beige and neutral palette, soft natural sunlight, minimalist style. Captured with Canon EOS R6, 35mm lens, f/4, natural window light, high-resolution, interior photography, hygge atmosphere. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Single flower in glass vase on white table, pastel background, minimal shadows. Captured with Sony A7R IV, 100mm lens, f/2.8, soft natural light, high-resolution, still life photography, elegant simplicity. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Desert sand dunes in pastel beige with soft pink sky, minimalist landscape. Captured with Canon 5D Mark IV, 24-70mm lens, f/8, soft natural light, high-resolution, landscape photography, serene beauty. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Flat lay of pastel notebooks, pens, and glasses on clean white background, minimal design. Captured with Nikon Z7 II, 50mm lens, f/4, soft natural light, high-resolution, flat lay photography, organized creativity. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Smoothie bowl with pastel fruits on clean white table, minimal food photography. Captured with Sony A7R V, 85mm lens, f/2.8, natural window light, high-resolution, food photography, fresh and healthy. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Ocean waves at sunrise, pastel pink and blue gradient sky, minimalist seascape. Captured with Canon EOS R5, 24mm lens, f/8, soft natural light, high-resolution, coastal photography, peaceful morning. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimal horizon line over calm water, pastel gradient sunset sky. Captured with Sony A7R IV, 35mm lens, f/8, golden hour light, high-resolution, landscape photography, serene simplicity. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimal beach with pastel umbrellas on sand, flat lay aesthetic, soft tones. Captured with Nikon Z7 II, 50mm lens, f/4, soft natural light, high-resolution, beach photography, summer mood. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Abstract geometric shapes in pastel colors, clean background, minimal composition. Captured with Canon 5D Mark IV, 85mm lens, f/2.8, soft natural light, high-resolution, abstract photography, modern design. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Flat lay of pastel-colored cupcakes on white background, soft light, minimal style. Captured with Sony A7R V, 100mm lens, f/2.8, natural window light, high-resolution, food photography, sweet treats. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Mountain silhouette at sunrise, pastel gradient sky, minimalist watercolor style. Captured with Canon EOS R6, 70-200mm lens, f/8, soft natural light, high-resolution, landscape photography, dreamy peaks. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimal reading corner with pastel cushions, books, and soft sunlight. Captured with Nikon Z7 II, 35mm lens, f/4, natural window light, high-resolution, interior photography, cozy atmosphere. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Pastel balloons floating in clear blue sky, minimal dreamy aesthetic. Captured with Sony A7R IV, 85mm lens, f/2.8, soft natural light, high-resolution, sky photography, lighthearted joy. Landscape orientation, photorealistic, natural lighting, no artificial or staged look"
  ],
  'lofi-music': [
    "Natural realistic photo: Cozy bedroom study setup with laptop, coffee cup, and warm lamp light during rainy evening. Captured with Sony A7R V, 50mm lens, f/2.8, soft warm lighting, high-resolution, lifestyle photography, study vibes. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Vintage record player spinning vinyl with warm golden light streaming through window blinds. Captured with Canon EOS R5, 85mm lens, f/2.8, natural window light, high-resolution, music photography, nostalgic atmosphere. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimalist desk with open notebook, pen, and steaming tea cup beside a window showing city lights at dusk. Captured with Nikon Z7 II, 35mm lens, f/4, soft natural light, high-resolution, workspace photography, evening study mood. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Cozy window seat with cushions, books, and a cup of hot chocolate during a gentle rain shower outside. Captured with Sony A7R IV, 50mm lens, f/2.8, warm indoor lighting, high-resolution, lifestyle photography, reading nook vibes. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Vintage headphones resting on a wooden desk beside a glowing laptop screen with soft ambient lighting. Captured with Canon 5D Mark IV, 85mm lens, f/2.8, warm desk lamp light, high-resolution, tech photography, music listening setup. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Peaceful library corner with armchair, reading lamp, and stack of books during quiet evening hours. Captured with Nikon Z7 II, 35mm lens, f/4, soft lamp lighting, high-resolution, interior photography, study sanctuary. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Coffee shop window table with laptop, latte art, and city street view during golden hour. Captured with Sony A7R V, 50mm lens, f/2.8, natural window light, high-resolution, cafe photography, work from cafe vibes. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Bedroom window with rain droplets and warm interior lighting creating cozy atmosphere for evening relaxation. Captured with Canon EOS R6, 35mm lens, f/4, mixed lighting, high-resolution, lifestyle photography, rainy day comfort. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimalist music studio setup with keyboard, headphones, and soft LED strip lighting in dark room. Captured with Sony A7R IV, 50mm lens, f/2.8, ambient LED light, high-resolution, music production photography, creative workspace. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Cozy balcony scene with string lights, plants, and city skyline view during peaceful evening. Captured with Nikon Z7 II, 24mm lens, f/4, string light ambiance, high-resolution, outdoor photography, urban relaxation. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Vintage radio and cassette tapes on wooden shelf with warm lamp creating nostalgic music corner. Captured with Canon 5D Mark IV, 85mm lens, f/2.8, warm lamp light, high-resolution, vintage photography, retro music vibes. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Study desk with open textbooks, highlighters, and energy drink during late night study session. Captured with Sony A7R V, 50mm lens, f/2.8, desk lamp lighting, high-resolution, student photography, academic focus. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Window view of snow falling outside while warm interior shows cozy reading setup with blanket and hot tea. Captured with Nikon Z7 II, 35mm lens, f/4, warm interior lighting, high-resolution, seasonal photography, winter comfort. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimalist bedroom with bed, laptop, and soft fairy lights creating peaceful evening atmosphere. Captured with Canon EOS R5, 50mm lens, f/2.8, fairy light ambiance, high-resolution, bedroom photography, evening relaxation. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Coffee table with open book, reading glasses, and steaming mug during quiet morning hours. Captured with Sony A7R IV, 85mm lens, f/2.8, natural morning light, high-resolution, lifestyle photography, morning routine. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Vintage typewriter on wooden desk with scattered papers and warm desk lamp during creative writing session. Captured with Nikon Z7 II, 50mm lens, f/2.8, warm lamp light, high-resolution, writing photography, creative process. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Cozy corner with bean bag, laptop, and soft blanket during lazy Sunday afternoon. Captured with Canon 5D Mark IV, 35mm lens, f/4, natural afternoon light, high-resolution, relaxation photography, weekend vibes. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Window sill with potted plants, coffee cup, and city view during peaceful morning hours. Captured with Sony A7R V, 50mm lens, f/2.8, natural morning light, high-resolution, plant photography, morning zen. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Minimalist workspace with monitor, keyboard, and warm desk lamp during productive evening work session. Captured with Nikon Z7 II, 35mm lens, f/4, desk lamp lighting, high-resolution, work photography, focus mode. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Cozy living room with soft couch, throw pillows, and warm ambient lighting during evening relaxation time. Captured with Canon EOS R6, 50mm lens, f/2.8, ambient room lighting, high-resolution, home photography, evening unwind. Landscape orientation, photorealistic, natural lighting, no artificial or staged look"
  ],
  product: [
    "Natural realistic photo: Close-up shot of premium wireless headphones on clean white background with soft natural lighting. Captured with Sony A7R V, 100mm macro lens, f/5.6, studio lighting, high-resolution, product photography, commercial quality. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of luxury watch face showing intricate craftsmanship and premium materials. Captured with Canon EOS R5, 105mm macro lens, f/4, soft natural light, high-resolution, jewelry photography, luxury product. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of smartphone displaying beautiful interface on marble surface with clean composition. Captured with Nikon Z7 II, 85mm lens, f/4, natural window light, high-resolution, tech product photography, modern design. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of premium coffee mug with steam rising from hot beverage on wooden table. Captured with Sony A7R IV, 100mm macro lens, f/2.8, soft natural light, high-resolution, food product photography, lifestyle brand. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of elegant perfume bottle with golden cap and crystal clear glass on white background. Captured with Canon 5D Mark IV, 90mm macro lens, f/4, studio lighting, high-resolution, beauty product photography, luxury cosmetics. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of leather wallet showing premium texture and craftsmanship details. Captured with Nikon Z7 II, 105mm macro lens, f/5.6, natural window light, high-resolution, fashion product photography, luxury accessories. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of modern laptop with sleek design and premium finish on clean background. Captured with Sony A7R V, 85mm lens, f/4, soft natural light, high-resolution, tech product photography, professional equipment. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of ceramic coffee cup with beautiful glaze and perfect form on marble surface. Captured with Canon EOS R6, 100mm macro lens, f/2.8, natural window light, high-resolution, home product photography, artisan craft. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of premium sunglasses with reflective lenses and elegant frame design. Captured with Nikon Z7 II, 90mm macro lens, f/4, soft natural light, high-resolution, fashion product photography, luxury eyewear. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of wooden cutting board with natural grain and artisan craftsmanship. Captured with Sony A7R IV, 105mm macro lens, f/5.6, natural window light, high-resolution, kitchen product photography, handmade quality. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of premium skincare bottle with minimalist design and clean aesthetics. Captured with Canon 5D Mark IV, 85mm macro lens, f/4, soft natural light, high-resolution, beauty product photography, wellness brand. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of mechanical keyboard with premium keycaps and RGB lighting. Captured with Nikon Z7 II, 100mm macro lens, f/2.8, natural window light, high-resolution, tech product photography, gaming equipment. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of elegant wine glass with crystal clarity and premium stem design. Captured with Sony A7R V, 90mm macro lens, f/4, soft natural light, high-resolution, home product photography, luxury dining. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of premium sneaker with clean design and high-quality materials. Captured with Canon EOS R5, 105mm macro lens, f/5.6, natural window light, high-resolution, fashion product photography, athletic footwear. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of modern smartwatch with sleek interface and premium band material. Captured with Nikon Z7 II, 85mm macro lens, f/4, soft natural light, high-resolution, tech product photography, wearable device. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of ceramic plant pot with beautiful texture and natural earth tones. Captured with Sony A7R IV, 100mm macro lens, f/2.8, natural window light, high-resolution, home product photography, garden decor. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of premium backpack with quality zippers and durable fabric construction. Captured with Canon 5D Mark IV, 90mm macro lens, f/4, soft natural light, high-resolution, fashion product photography, outdoor gear. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of wooden desk organizer with natural finish and functional design. Captured with Nikon Z7 II, 105mm macro lens, f/5.6, natural window light, high-resolution, office product photography, workspace organization. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Close-up shot of premium candle with elegant jar and natural wax texture. Captured with Sony A7R V, 85mm macro lens, f/4, soft natural light, high-resolution, home product photography, wellness lifestyle. Landscape orientation, photorealistic, natural lighting, no artificial or staged look",
    "Natural realistic photo: Detailed close-up of modern water bottle with sleek design and premium materials. Captured with Canon EOS R6, 100mm macro lens, f/2.8, natural window light, high-resolution, lifestyle product photography, health wellness. Landscape orientation, photorealistic, natural lighting, no artificial or staged look"
  ],
  'oil-painted': [
    "Oil painted photograph: Beautiful landscape of rolling hills and wildflowers painted with rich oil brushstrokes and vibrant colors. Realistic oil painting style with visible brush texture, thick paint application, and artistic depth. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Portrait of a woman with flowing hair painted in classical oil painting style with rich colors and visible brushstrokes. Realistic oil painting technique with smooth blending and artistic texture. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Still life of fresh fruits on wooden table painted with thick oil paint and visible brush marks. Classical oil painting style with rich colors and artistic texture. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Seascape with crashing waves painted in impressionist oil style with bold brushstrokes and vibrant blues. Realistic oil painting with visible paint texture and artistic depth. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Forest scene with tall trees painted in oil with rich greens and browns, showing visible brushstrokes and paint texture. Realistic oil painting style with artistic depth and natural colors. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: City street scene painted in oil with warm colors and visible brushstrokes creating artistic atmosphere. Realistic oil painting technique with rich texture and urban beauty. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Garden flowers painted in oil with vibrant colors and thick paint application showing artistic brushwork. Classical oil painting style with rich texture and natural beauty. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Mountain landscape painted in oil with dramatic colors and visible brushstrokes creating artistic depth. Realistic oil painting with rich texture and natural grandeur. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Vintage car painted in oil with rich colors and smooth brushstrokes showing classic automotive beauty. Realistic oil painting style with artistic texture and nostalgic charm. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Cottage house painted in oil with warm colors and visible brush marks creating cozy atmosphere. Classical oil painting technique with rich texture and rural charm. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Lake reflection painted in oil with smooth water and rich colors showing artistic brushwork. Realistic oil painting style with peaceful atmosphere and natural beauty. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Autumn trees painted in oil with golden colors and thick paint application showing seasonal beauty. Classical oil painting with visible brushstrokes and rich texture. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Portrait of elderly man painted in oil with rich skin tones and visible brushstrokes showing character. Realistic oil painting technique with artistic depth and human emotion. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Market scene painted in oil with vibrant colors and busy atmosphere showing artistic brushwork. Realistic oil painting style with rich texture and lively energy. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Sunset sky painted in oil with warm colors and dramatic brushstrokes creating artistic atmosphere. Classical oil painting with rich texture and natural beauty. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Horse in field painted in oil with rich browns and greens showing visible brush marks and artistic texture. Realistic oil painting style with natural beauty and animal grace. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Bridge over river painted in oil with architectural details and water reflections showing artistic brushwork. Classical oil painting technique with rich texture and structural beauty. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Wine glass painted in oil with transparent effects and rich colors showing artistic technique. Realistic oil painting style with smooth blending and elegant composition. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Lighthouse on cliff painted in oil with dramatic sky and ocean showing visible brushstrokes. Classical oil painting with rich texture and coastal atmosphere. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look",
    "Oil painted photograph: Field of sunflowers painted in oil with bright yellows and visible brush marks creating artistic beauty. Realistic oil painting style with rich texture and natural vibrancy. Landscape orientation, oil painting aesthetic, natural lighting, no artificial or staged look"
  ]
};

// Unique, meaningful titles for each category (no repetitive words)
const uniqueTitles = {
  space: [
    "Spiral Galaxy Swirl",
    "Colorful Nebula Birth",
    "Earth Blue Planet",
    "Solar System Planets",
    "Aurora Polar Lights",
    "Black Hole Horizon",
    "Star Cluster Blue",
    "Supernova Explosion",
    "Comet Tail Streak",
    "Planetary Ring System",
    "Galaxy Collision Merge",
    "Space Station Orbit",
    "Mars Red Landscape",
    "Enceladus Ice Geysers",
    "Exoplanet Blue Oceans",
    "Milky Way Starfield",
    "Solar Flare Plasma",
    "Asteroid Belt Rocks",
    "Jupiter Red Spot",
    "Andromeda Galaxy Approach"
  ],
  'pixel-art': [
    "Girl Dog Park Play",
    "Knight Horse Forest",
    "Cat Dog Window Rain",
    "Boy Ducks Pond Feed",
    "Farmer Cows Meadow",
    "Girl Bird Bicycle Ride",
    "Rabbits Garden Butterflies",
    "Cowboy Horse Desert",
    "Girl Teddy Bear Hug",
    "Boy Turtle Underwater",
    "Princess Unicorn Forest",
    "Girl Horses Stable Feed",
    "Boy Puppy Garden Fetch",
    "Fisherman Cat Adventure",
    "Girl Hamster Book Read",
    "Boy Parrot Treehouse Talk",
    "Warrior Wolf Companion",
    "Girl Butterflies Meadow Dance",
    "Boy Canary Birdhouse Build",
    "Explorer Robot Dog Space",
    "Girl Deer Forest Feed",
    "Boy Rabbit Tea Party",
    "Pirate Parrot Treasure Hunt",
    "Girl Kitten Hide Seek",
    "Boy Lizard Jungle Explore",
    "Knight Falcon Soaring",
    "Girl Puppy Cuddle Sleep",
    "Boy Duck Pond Fishing",
    "Wizard Owl Magical",
    "Girl Butterfly Garden Plant"
  ],
  music: [
    "DJ Setup Neon Studio",
    "Singer Microphone Spotlight",
    "Guitarist Electric Amplifier",
    "Pianist Grand Piano Concert",
    "Drummer Kit Live Performance",
    "Producer Laptop Studio",
    "Saxophone Jazz Club",
    "Violinist Orchestra Sheet Music",
    "Bassist Electric Rehearsal",
    "Singer Acoustic Coffee Shop",
    "Producer Synthesizer Home Studio",
    "Concert Crowd Phone Lights",
    "Vinyl Record Turntable Vintage",
    "Music Festival Stage Lights",
    "Studio Control Room Mixing",
    "Street Musician Guitar Sidewalk",
    "Streaming Podcast Microphone",
    "Jazz Trio Piano Bass Drums",
    "Rock Band Stage Electric",
    "Cellist Concert Hall Elegant",
    "Hip-Hop Producer Beat Machine",
    "Acoustic Duo Guitar Park",
    "Music Video Filming Set",
    "Music Store Instruments Display",
    "Concert Photographer Camera",
    "Music Teacher Piano Lesson",
    "Streaming Playlist Laptop",
    "Music Therapy Instruments",
    "Music Awards Red Carpet",
    "Rehearsal Space Band Equipment"
  ],
  medieval: [
    "Village Stone Houses Marketplace",
    "Castle Hilltop Towers Drawbridge",
    "Tavern Wooden Beams Candles",
    "Blacksmith Anvil Forge Embers",
    "Knight Armor Warhorse Forest",
    "Village Square Fountain Stalls",
    "Wizard Tower Spiral Staircase",
    "Farmhouse Thatched Roof Wheat",
    "Cathedral Stained Glass Pillars",
    "Dragon Castle Tower Wings",
    "Marketplace Merchants Banners",
    "Forest Path Ancient Trees",
    "Siege Catapults Archers Walls",
    "Alchemist Laboratory Potions",
    "Village Sunset Golden Light",
    "Tournament Jousting Arena Tents",
    "Dungeon Stone Walls Torches",
    "Herbalist Garden Plants",
    "Port Town Ships Quays",
    "Library Bookshelves Scrolls",
    "Windmill Hill Blades Stone",
    "Bridge River Arches Moss",
    "Village Festival Decorations Music",
    "Watchtower Cliff Views",
    "Stables Horses Hay Stalls",
    "Apothecary Bottles Shelves",
    "Village Well Bucket Water",
    "Forge Metal Hammer Sparks",
    "Inn Sign Windows Travelers",
    "Village Gate Doors Guards"
  ],
  lifestyle: [
    "Golden Hour Coffee Shop Reading",
    "Family Kitchen Cooking Joy",
    "City Skyline Morning Yoga",
    "Oak Tree Picnic Gathering",
    "Mountain View Home Office",
    "Autumn Neighborhood Stroll",
    "Garden Play Adventures",
    "Peaceful Living Room Meditation",
    "Patio Dinner Conversations",
    "Organized Closet Serenity",
    "Cozy Family Movie Time",
    "Windowsill Herb Haven",
    "Bicycle Morning Journey",
    "Tabletop Game Night",
    "Armchair Tea Moments",
    "Sunrise Kitchen Partnership",
    "Blanket Fort Dreams",
    "Journal Writing Sanctuary",
    "Backyard String Light Gathering",
    "Home Library Organization"
  ],
  animals: [
    "Golden Retriever Wildflower Leap",
    "Tabby Cat Windowsill Dreams",
    "Bald Eagle Mountain Soar",
    "Elephant Mother Child Bond",
    "Scarlet Macaw Rainforest Portrait",
    "Ocean Jump Joy",
    "Winter Forest Explorer",
    "Garden Butterfly Landing",
    "Sunset Field Gallop",
    "Ancient Forest Wisdom",
    "Antarctic Colony Gathering",
    "Summer Flower Hover",
    "Wilderness Pack Rest",
    "Coral Reef Swimming",
    "Forest Stream Drinking",
    "Jungle Canopy Swing",
    "River Salmon Catch",
    "Spring Daisy Meadow",
    "Ocean Surface Breach",
    "Autumn Acorn Collection"
  ],
  sports: [
    "Urban Court Bounce",
    "Field Goal Distance",
    "Clay Court Ready",
    "Lane Marker Clarity",
    "Trail Leaf Crunch",
    "Stadium Grass Catch",
    "Mountain Trail Lean",
    "Green Course Precision",
    "Beach Wave Stand",
    "Cliff Face Gear",
    "Pond Sky Reflection",
    "Ocean Net Setup",
    "Lake Calm Paddle",
    "Gym Light Stream",
    "Deck Nature View",
    "Ramp Concrete Curve",
    "River Sunrise Cast",
    "Vista Trail Boots",
    "Court Air Freeze",
    "Range Target Focus"
  ],
  fashion: [
    "Window Vintage Elegance",
    "Marble Table Luxury",
    "Antique Chair Grace",
    "Closet Natural Display",
    "Velvet Cushion Pearls",
    "Cafe Casual Drape",
    "Boardwalk Sunset Reflection",
    "Desk Morning Timepiece",
    "Garden Breeze Flow",
    "Linen Bed Comfort",
    "Display Stand Sparkle",
    "Doorway Rain Ready",
    "Closet Light Silk",
    "Dresser Surface Coil",
    "Bedroom Floor Flow",
    "Entrance Hook Warmth",
    "Morning Light Delicate",
    "Porch Garden View",
    "Window Street Reflection",
    "Chair Reading Comfort"
  ],
  automotive: [
    "Sunrise Mountain Curve",
    "Garage Tool Gleam",
    "City Station Modern",
    "Countryside Barn Classic",
    "Tunnel Light Reflection",
    "Coastal Highway Freedom",
    "Campsite Mountain Base",
    "Track Motion Speed",
    "Driveway Bicycle Lean",
    "Parking Lot Rest",
    "Sunlight Dashboard View",
    "Starry Drive Theater",
    "Trailhead Gear Load",
    "Street Puddle Mirror",
    "Beach Wave Classic",
    "Cafe Street Electric",
    "Forest Autumn Drive",
    "Overlook Valley Park",
    "Solar Panel Station",
    "Car Show Display"
  ],
  art: [
    "Palette Blue Dip",
    "Gallery Shadow Drama",
    "Studio Easel Progress",
    "Wheel Clay Shape",
    "Brick Wall Brightness",
    "Park Shade Sketch",
    "Floor Rainbow Cast",
    "Paper Gradient Mix",
    "Garden Metal Gleam",
    "Surface Charcoal Emerge",
    "Table Pattern Intricate",
    "Wall Brush Dry",
    "Parchment Elegant Flow",
    "Gallery Bold Hang",
    "Light Canvas Fill",
    "Design Floral Paint",
    "Wall Colorful Work",
    "Darkroom Print Hang",
    "Loom Thread Create",
    "Glass Molten Shape"
  ],
  science: [
    "Slide Cell Rainbow",
    "Lab Liquid Bright",
    "Rooftop Star Point",
    "Light Helix Rotate",
    "Bench Reaction Bubble",
    "Sky Panel Gleam",
    "Greenhouse Plant Examine",
    "Screen Data Complex",
    "Scale Substance Precise",
    "Lamp Culture Colorful",
    "Cloud Balloon Float",
    "Paper Activity Record",
    "Spectrum Light Split",
    "Notebook Observation Fill",
    "Arm Experiment Precise",
    "Rock Fossil Excavate",
    "Suit White Clean",
    "Distance Tunnel Stretch",
    "Brain Scanner Detail",
    "Stream Sample Collect"
  ],
  education: [
    "Desk Pencil Open",
    "Chalk Equation Cover",
    "Circle Outdoor Read",
    "Ceiling Book Reach",
    "Sunlight Cap Diploma",
    "Classroom Hand Eager",
    "Ribbon Notebook Stack",
    "Together Code Learn",
    "Model Volcano Display",
    "Window Easel Paint",
    "Recess Play Children",
    "Empty Plan Write",
    "Seat Wooden Row",
    "Corner Quiet Study",
    "Space Collaborative Meet",
    "Safe Experiment Conduct",
    "Instrument Arrange Care",
    "Material Colorful Learn",
    "Home Laptop Setup",
    "Building Brick Park"
  ],
  healthcare: [
    "Chart Office Rest",
    "Light Bed Comfort",
    "Expression Care Check",
    "Screen Rhythm Monitor",
    "Medication Shelf Organize",
    "Sink Hand Wash",
    "Entrance Emergency Park",
    "Exercise Walking Help",
    "Procedure Scanner Ready",
    "Tray Sterile Arrange",
    "Artwork Comfort Chair",
    "Arm Cuff Wrap",
    "Sample Laboratory Examine",
    "Lighting Floor Clean",
    "Aid Visual Explain",
    "Atmosphere Peaceful Mat",
    "Equipment Advanced Research",
    "Care Patient Emergency",
    "Therapist Equipment Gym",
    "Visit Room Consultation"
  ],
  music: [
    "Spotlight Key Gleam",
    "Room Cozy Lean",
    "Case Velvet Rest",
    "Microphone Stage Position",
    "Pencil Bench Scatter",
    "Equipment Soundproof Wall",
    "Stage Empty Ready",
    "Room Production Hook",
    "Lighting Jazz Gleam",
    "Garage Amplifier Plug",
    "Show Instrument Fill",
    "Style Animated Float",
    "Needle Record Spin",
    "Pipe Pew Wooden",
    "Wave Ocean Towel",
    "Formation Light Reflect",
    "Bench Together Sit",
    "Speaker Light Colorful",
    "Wall Practice Lean",
    "Case Open Play"
  ],
  anime: [
    "Sunset Metropolis Skyline",
    "Cyberpunk Night City",
    "Traditional Japanese Town",
    "Fantasy Floating Islands",
    "Trendy Blue Hair Street",
    "Kawaii Pink Twin Buns",
    "Badass Cyberpunk Silver",
    "Casual Black Hair Cafe",
    "Gothic Rainbow Cathedral",
    "Sports Red Hair Court",
    "Purple Hair LED Room",
    "Elegant White Suit",
    "Brown Hair Garden Walk",
    "Punk Multicolor Music",
    "Silver Fantasy Forest",
    "Pink Techwear Future",
    "Orange Vintage Retro",
    "Black Kimono Garden",
    "Blonde Rooftop City",
    "Blue Sporty Gym"
  ],
  aesthetic: [
    "Pastel Workspace",
    "Santorini Sunset",
    "Marble Morning",
    "Cotton Candy Clouds",
    "Pastel Shoreline",
    "Minimal Desk",
    "Watercolor Skyline",
    "Neutral Living Room",
    "Single Bloom",
    "Pastel Desert",
    "Stationery Flat Lay",
    "Smoothie Bowl Aesthetic",
    "Pastel Ocean Sunrise",
    "Soft Horizon",
    "Beach Umbrellas",
    "Abstract Pastels",
    "Cupcake Charm",
    "Sunrise Peaks",
    "Reading Nook",
    "Floating Balloons"
  ],
  'lofi-music': [
    "Cozy Bedroom Study",
    "Vintage Record Player",
    "Minimalist Evening Desk",
    "Window Seat Reading",
    "Vintage Headphones Setup",
    "Peaceful Library Corner",
    "Coffee Shop Golden Hour",
    "Rainy Day Bedroom",
    "Minimalist Music Studio",
    "Cozy Balcony Lights",
    "Vintage Radio Corner",
    "Late Night Study Desk",
    "Winter Window View",
    "Fairy Light Bedroom",
    "Morning Coffee Table",
    "Vintage Typewriter Desk",
    "Lazy Sunday Corner",
    "Window Sill Plants",
    "Evening Work Setup",
    "Cozy Living Room"
  ],
  product: [
    "Premium Wireless Headphones",
    "Luxury Watch Face",
    "Smartphone Interface",
    "Premium Coffee Mug",
    "Elegant Perfume Bottle",
    "Leather Wallet Detail",
    "Modern Laptop Design",
    "Ceramic Coffee Cup",
    "Premium Sunglasses",
    "Wooden Cutting Board",
    "Skincare Bottle Design",
    "Mechanical Keyboard",
    "Elegant Wine Glass",
    "Premium Sneaker Detail",
    "Modern Smartwatch",
    "Ceramic Plant Pot",
    "Premium Backpack",
    "Wooden Desk Organizer",
    "Premium Candle Jar",
    "Modern Water Bottle"
  ],
  'oil-painted': [
    "Rolling Hills Wildflowers",
    "Portrait Flowing Hair",
    "Still Life Fresh Fruits",
    "Seascape Crashing Waves",
    "Forest Tall Trees",
    "City Street Warm Colors",
    "Garden Flowers Vibrant",
    "Mountain Landscape Dramatic",
    "Vintage Car Classic",
    "Cottage House Cozy",
    "Lake Reflection Peaceful",
    "Autumn Trees Golden",
    "Portrait Elderly Man",
    "Market Scene Vibrant",
    "Sunset Sky Dramatic",
    "Horse Field Natural",
    "Bridge River Architectural",
    "Wine Glass Transparent",
    "Lighthouse Cliff Coastal",
    "Sunflowers Field Bright"
  ]
};

let totalGenerated = 0;
let totalCost = 0;

// Generate unique natural title from prompt (no AI tags, no numbers)
function generateUniqueTitle(category, index, prompt) {
  const titles = uniqueTitles[category] || [];
  
  // If we have a predefined title, use it
  if (titles[index]) {
    return titles[index];
  }
  
  // Otherwise, create a unique title from the prompt
  const words = prompt.split(' ').slice(0, 6); // Take first 6 words
  const title = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .trim();
  
  // Add index to make it unique if needed
  return index > 0 ? `${title} ${index + 1}` : title;
}

// Generate image using Azure OpenAI DALL-E 3
async function generateWithDallE(prompt, category, index) {
  try {
    const response = await fetch('http://localhost:3000/api/azure-ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Natural realistic photo: ${prompt}. Landscape orientation, photorealistic, natural lighting, no artificial or staged look`,
        quality: 'landscape',
        style: 'natural'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Azure API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (data.success && data.image && data.image.url) {
      // Download and convert to base64
      const imageResponse = await fetch(data.image.url);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = `data:image/png;base64,${Buffer.from(imageBuffer).toString('base64')}`;

      // Save with unique natural title
      const title = generateUniqueTitle(category, index, prompt);
      
      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const saveResponse = await fetch('http://localhost:3000/api/ai/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: imageBase64,
          prompt: prompt,
          categoryId: category,
          title: title,
          description: prompt, // Use the detailed prompt as description
          dimensions: { width: 1792, height: 1024 },
          tags: ['gpt-image-1', 'azure', 'natural', 'realistic', category],
          slug: slug
        }),
      });

      if (saveResponse.ok) {
        totalGenerated++;
        totalCost += 0.04; // OpenAI DALL-E 3 HD pricing
        console.log(`✅ Saved: ${title}`);
        return true;
      } else {
        console.log(`❌ Save failed: ${title}`);
        return false;
      }
    }
    return false;
  } catch (error) {
    console.log(`❌ DALL-E error: ${error.message}`);
    return false;
  }
}

// Generate images for a category
async function generateForCategory(categoryId, categoryName, targetCount, currentCount) {
  const prompts = naturalPrompts[categoryId] || [];
  const imagesNeeded = targetCount - currentCount;
  
  console.log(`\n🎨 Generating ${imagesNeeded} natural images for ${categoryName}...`);
  console.log(`📊 Current: ${currentCount} images, Target: ${targetCount} images`);
  
  for (let i = 0; i < imagesNeeded; i++) {
    const prompt = prompts[i % prompts.length];
    console.log(`   ${i + 1}/${imagesNeeded}: ${prompt.substring(0, 60)}...`);
    
    await generateWithDallE(prompt, categoryId, i);
    
    // Small delay between generations
    if (i < imagesNeeded - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  console.log(`✨ Completed ${categoryName} - ${imagesNeeded} new natural images`);
}

// Main execution
async function generateAllNaturalImages() {
  console.log('🌟 Starting Natural Image Generation with AI Source Tracking');
  console.log(`📊 Generating ${missingCategories.length} categories with unique titles`);
  console.log('🎯 Focus: Natural, realistic images with meaningful names\n');

  for (let i = 0; i < missingCategories.length; i++) {
    const category = missingCategories[i];
    await generateForCategory(category.id, category.name, category.target, category.current);
    
    // Pause between categories
    if (i < missingCategories.length - 1) {
      console.log('⏳ Category break (3 seconds)...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n🎉 NATURAL IMAGE GENERATION COMPLETE!');
  console.log(`📈 Total generated: ${totalGenerated} unique images`);
  console.log(`💰 Estimated cost: $${totalCost.toFixed(2)}`);
  console.log('🏷️  All images tagged with AI source (GPT-Image-1)');
  console.log('✨ Each image has unique, meaningful title');
}

// Run the generator
generateAllNaturalImages().catch(console.error); 