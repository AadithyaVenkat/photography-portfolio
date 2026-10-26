export type Category = 'landscape' | 'street' | 'details'

export interface Photo {
  id: string
  title: string
  category: Category
  image: string
  width: number
  height: number
  alt: string
  story: string
  fieldNote: string
  plate: string
  pairing?: 'lead' | 'diptych-left' | 'diptych-right' | 'panoramic'
  author: string
  source: string
  sample: boolean
}

export interface JournalStory {
  id: string
  category: Category
  title: string
  subtitle: string
  kicker: string
  introduction: string
  passage: string
  closing: string
  curatorialNote: string
  photoIds: string[]
  tone: 'light' | 'night'
}

export const categoryLabels: Record<Category, string> = {
  landscape: 'Landscapes', street: 'Street', details: 'Details',
}

export const journalStories: JournalStory[] = [
  {
    id: 'the-quiet',
    category: 'landscape',
    kicker: 'Essay I · Altitude, Water & Treeline',
    title: 'Where the world slows.',
    subtitle: 'On distance, stillness, and a little room to breathe.',
    introduction: 'First, the scale of a mountain ridge under pale air. Then the open horizon, almost without an edge. There is a different rhythm to these four frames: less to chase, more to sit with as the eye adjusts to distance.',
    passage: 'The sequence moves from open altitude into dense woodland, and finally back to still water. Not a record of one route, but a quiet conversation between places that ask you to lower your pace.',
    closing: 'Sometimes a photograph is less about where you went, and more about where your attention stayed.',
    curatorialNote: 'Four plates arranged from high ridge to shoreline, paired by horizon line and reflected light.',
    photoIds: ['29', '16', '28', '11'],
    tone: 'light',
  },
  {
    id: 'in-between',
    category: 'street',
    kicker: 'Essay II · Transit & Urban Geometry',
    title: 'The city, in between.',
    subtitle: 'Two frames from the life unfolding around us.',
    introduction: 'A city is never just its landmarks. It is the space between one crossing and the next—suspended cables above water, the geometry of facades, and the brief interruptions that make a familiar street feel newly strange.',
    passage: 'Look once for the whole structure. Then look again for the edges and wires cutting the sky. A shift in angle turns the same everyday transit into an entirely different story.',
    closing: 'A place does not have to be unfamiliar to deserve another look.',
    curatorialNote: 'A two-plate diptych contrasting wide bridge span with vertical street-level perspective.',
    photoIds: ['43', '57'],
    tone: 'night',
  },
  {
    id: 'closer-looking',
    category: 'details',
    kicker: 'Essay III · Surface, Form & Canopy',
    title: 'A closer kind of looking.',
    subtitle: 'Small things and quiet textures, given a little more time.',
    introduction: 'Not every story needs a distant horizon. Some begin with a roofline against coastal rock, a weathered surface, or the way daylight filters through branches we usually pass without a second thought.',
    passage: 'Two distinct textures held together by the same small act: choosing to pause. Tightening the frame turns an overlooked fragment into the whole subject.',
    closing: 'There is always another photograph hiding inside the everyday.',
    curatorialNote: 'Close-focus studies pairing coastal architecture with layered forest canopy.',
    photoIds: ['49', '10'],
    tone: 'light',
  },
]

export const photos: Photo[] = [
  { id: '29', plate: 'Plate 01 · I.A', pairing: 'lead', title: 'A quieter world', category: 'landscape', image: 'images/sample-29.jpg', width: 4000, height: 2670,
    alt: 'A mountain landscape beneath a pale sky', story: 'The world feels different when there is room to look a little longer.',
    fieldNote: 'Opening frame — High ridge and pale atmospheric haze set the scale for the sequence.',
    author: 'Go Wild', source: 'https://unsplash.com/photos/V0yAek6BgGk', sample: true },
  { id: '16', plate: 'Plate 02 · I.B', pairing: 'diptych-left', title: 'Nothing but the horizon', category: 'landscape', image: 'images/sample-16.jpg', width: 2500, height: 1667,
    alt: 'A quiet view across the water toward the horizon', story: 'A line between two worlds, and a moment with nowhere else to be.',
    fieldNote: 'Second frame — The ridge line flattens into open sea and low coastal rock.',
    author: 'Paul Jarvis', source: 'https://unsplash.com/photos/gkT4FfgHO5o', sample: true },
  { id: '43', plate: 'Plate 05 · II.A', pairing: 'lead', title: 'In passing', category: 'street', image: 'images/sample-43.jpg', width: 1280, height: 831,
    alt: 'An urban scene in natural light', story: 'The familiar becomes something new when we stop moving for a moment.',
    fieldNote: 'Opening frame — Bridge towers and evening mist anchor the urban sequence.',
    author: 'Oleg Chursin', source: 'https://unsplash.com/photos/IoCWq07GaG4', sample: true },
  { id: '28', plate: 'Plate 03 · I.C', pairing: 'diptych-right', title: 'Into the green', category: 'landscape', image: 'images/sample-28.jpg', width: 4928, height: 3264,
    alt: 'Green woodland filled with trees and soft light', story: 'Layers of green, a little light, and the feeling of being somewhere else.',
    fieldNote: 'Third frame — Open water gives way to enclosed forest canopy and diffused light.',
    author: 'Jerry Adney', source: 'https://unsplash.com/photos/_WiFMBRT7Aw', sample: true },
  { id: '49', plate: 'Plate 07 · III.A', pairing: 'diptych-left', title: 'The shape of things', category: 'details', image: 'images/sample-49.jpg', width: 1280, height: 792,
    alt: 'A study of shapes and textures in natural light', story: 'An ordinary detail, given a frame of its own.',
    fieldNote: 'Opening frame — Whitewashed geometry against cliffside stone and sea air.',
    author: 'Margaret Barley', source: 'https://unsplash.com/photos/Qo51KwK1dKg', sample: true },
  { id: '11', plate: 'Plate 04 · I.D', pairing: 'panoramic', title: 'A moment, reflected', category: 'landscape', image: 'images/sample-11.jpg', width: 2500, height: 1667,
    alt: 'Water reflecting a peaceful natural landscape', story: 'Some places ask for nothing more than a pause.',
    fieldNote: 'Closing frame — The essay resolves where valley, trees, and sky meet on still water.',
    author: 'Paul Jarvis', source: 'https://unsplash.com/photos/Cm7oKel-X2Q', sample: true },
  { id: '57', plate: 'Plate 06 · II.B', pairing: 'diptych-right', title: 'Somewhere along the way', category: 'street', image: 'images/sample-57.jpg', width: 2448, height: 3264,
    alt: 'A passing scene observed from a different perspective', story: 'A small story at the edge of an ordinary day.',
    fieldNote: 'Closing frame — Overhead wires and stone facades narrow the city into vertical lines.',
    author: 'Nicholas Swanson', source: 'https://unsplash.com/photos/SyBYM8R6VU4', sample: true },
  { id: '10', plate: 'Plate 08 · III.B', pairing: 'diptych-right', title: 'Between the branches', category: 'details', image: 'images/sample-10.jpg', width: 2500, height: 1667,
    alt: 'Trees and foliage in a green landscape', story: 'Light finds its own way through.',
    fieldNote: 'Closing frame — Repeating verticals of pine and mist echo the geometry of Plate 07.',
    author: 'Paul Jarvis', source: 'https://unsplash.com/photos/6J--NXulQCs', sample: true },
]

export function imageSource(photo: Photo): string {
  return /^https?:\/\//.test(photo.image) ? photo.image : `${import.meta.env.BASE_URL}${photo.image.replace(/^\//, '')}`
}