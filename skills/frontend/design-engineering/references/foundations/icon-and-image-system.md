# Icon and Image System

Default rules for icons, photographs, illustrations, and other media: which to use, how big, what shape, what format, and how to keep them from breaking a layout.

> **Platforms.** The rules here hold for web, mobile, and desktop. The code samples show the web expression in HTML and CSS. For iOS, Android, desktop apps, and business systems, translate units, sizes, and conventions with `platform-adaptation.md`.

Icon library choices are catalogued in `../ui-design/tokens/icons.md`.

## 1. Icons

### One set

Use one icon set per product. Mixing sets shows at once: stroke weights, corner styles, and optical sizes disagree.

| Property     | Rule                                                                  |
| ------------ | --------------------------------------------------------------------- |
| Style        | All outline or all filled. Filled may mark the selected state.        |
| Stroke       | One weight, usually 1.5 or 2 at 24. Scale the stroke with the size.   |
| Grid         | Drawn on a 24 unit grid with consistent padding                       |
| Colour       | `currentColor`, so icons take the text colour and theme automatically |
| Corner style | Matches the product's shape personality (sharp or rounded joins)      |

### Sizes

```css
:root {
  --icon-sm: 1rem; /* 16px: inline with small text, dense tables */
  --icon-md: 1.25rem; /* 20px: buttons, inputs, list rows */
  --icon-lg: 1.5rem; /* 24px: navigation, standalone actions */
  --icon-xl: 2rem; /* 32px: feature bullets, empty states */
}
```

- An icon beside text matches the text's cap height visually: 16 with 14 text, 20 with 16 text.
- Gap between icon and label: 8 px (4 px in dense rows).
- An icon-only button keeps a 44 px target whatever the glyph size.
- Decorative feature icons sit in a container of fixed size so a row of them aligns.

### Meaning and access

- An icon next to a label is decorative: hide it from assistive tech.
- An icon-only control needs an accessible name and, on pointer devices, a tooltip.
- Use only icons with an established meaning without a label (search, close, menu, back, settings). Everything else gets a label.
- Do not use emoji as icons. They render differently on every system and ignore the theme.
- Do not reuse one icon for two meanings, or two icons for one meaning.
- Directional icons mirror in right-to-left layouts. Clocks, checkmarks, and logos do not.

## 2. Imagery Ladder

Use the highest rung available.

1. **Real assets from the client or product**, optimised.
2. **A drawn motif from the subject's own world**, built in SVG or native vector drawing.
3. **A labelled slot** with the right aspect ratio and a caption saying what belongs there.

Never hotlink stock photography. Never invent a product screenshot, a customer photo, or a logo.

## 3. Aspect Ratios

Fix the frame, then fill it. A fixed frame means swapping the image never moves the layout.

| Ratio | Use                                        |
| ----- | ------------------------------------------ |
| 1:1   | Avatars, product thumbnails, gallery tiles |
| 4:3   | Cards, general photography                 |
| 3:2   | Editorial and photographic content         |
| 16:9  | Video, hero media, wide cards              |
| 4:5   | Portrait cards, mobile-first feeds         |
| 21:9  | Cinematic bands, short hero strips         |

```css
.media {
  aspect-ratio: 4 / 3;
  inline-size: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}
```

- One ratio per grid. Mixed ratios in one row are a defect.
- Set `object-position` per image when the subject is off-centre. Check the crop at the narrowest and widest frame.
- Never stretch. An image either covers its frame (cropped) or is contained (letterboxed) on purpose.
- A cropped-out watermark or caption is still there in the file. Use a clean source for anything public.

## 4. Formats and Weight

| Content                                | Format                                     |
| -------------------------------------- | ------------------------------------------ |
| Photographs                            | AVIF or WebP, JPEG fallback only if needed |
| Logos, icons, simple illustrations     | SVG                                        |
| Screenshots and images with sharp text | WebP lossless or PNG                       |
| Transparency over varied backgrounds   | WebP or AVIF with alpha                    |
| Short loops                            | Muted inline video, not animated GIF       |

- Export at the largest size displayed, times the device pixel ratio you support, and no larger. A 400 px slot rarely needs more than 1200 px of source.
- Serve several widths with `srcset` and `sizes` when the display size varies.
- Budget: hero image under about 200 KB, card images under about 100 KB each. An SVG that wraps an embedded bitmap is a bitmap; export the bitmap properly instead.
- Compress every image. An uncompressed export is the most common cause of a slow page.

## 5. Loading and Layout Stability

```html
<img
  src="work-01.webp"
  width="1280"
  height="960"
  alt="Red brick garage front with new brickwork above the door"
  loading="lazy"
  decoding="async"
/>
```

- Every image declares intrinsic `width` and `height`, or sits in a frame with `aspect-ratio`.
- Below-the-fold images load lazily. The largest above-the-fold image loads eagerly with high fetch priority.
- Give the frame a background colour close to the image's average tone so loading is calm.
- Provide a fallback for a failed image: initials for an avatar, a neutral frame with an icon elsewhere.

## 6. Alt Text

| Image                                | Alt text                                               |
| ------------------------------------ | ------------------------------------------------------ |
| Carries information                  | What it shows, in one sentence, without "image of"     |
| Is a link or button                  | Where it goes or what it does                          |
| Decorative, or repeats adjacent text | Empty: `alt=""`                                        |
| Chart or diagram                     | The conclusion, with the data available as text nearby |
| Text inside an image                 | The same text; better, use real text                   |

## 7. Text Over Images

- Place a solid or gradient layer between image and text that guarantees 4.5 to 1 at every crop.
- Keep text in the calm area of the image; set `object-position` so that area stays behind the text.
- Never rely on the image happening to be dark where the text is.

## 8. Avatars, Logos, Illustrations

- **Avatars:** circles at 24, 32, 40, or 48. Initials on a tinted fill when there is no photo. A group overlaps by a quarter of the diameter with a ring in the surface colour.
- **Logos:** SVG, with clear space equal to the logo's cap height on every side. In a client-logo row, set them to one optical height and one colour treatment.
- **Illustrations:** one style, a palette taken from the tokens, and a consistent stroke. An illustration explains or welcomes; it does not fill space.
- **Maps, charts, embeds:** frame them like media, with a fixed ratio and a text alternative.

## 9. On Other Platforms

| Concept         | iOS and macOS                                                      | Android                                           | Flutter                                             | Windows                                             |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| System icon set | SF Symbols, sized by text style                                    | Material Symbols                                  | `Icons` (Material) or `CupertinoIcons`              | Segoe Fluent Icons                                  |
| Icon colour     | `foregroundStyle`, template rendering                              | `tint` from the colour scheme                     | `IconTheme` colour                                  | `Foreground` brush                                  |
| Vector assets   | PDF or SVG in the asset catalogue                                  | Vector drawable                                   | SVG through a package, or icon fonts                | Path geometry or SVG image source                   |
| Bitmap density  | 1x, 2x, 3x in the asset catalogue                                  | Density buckets (mdpi to xxxhdpi)                 | 1.0x, 2.0x, 3.0x asset variants                     | Scale-qualified assets (100 to 400)                 |
| Aspect frame    | `.aspectRatio(_, contentMode: .fill)` with `.clipped()`            | `Modifier.aspectRatio()` with `ContentScale.Crop` | `AspectRatio` with `BoxFit.cover`                   | `Viewbox` or `Image` with `Stretch="UniformToFill"` |
| Lazy loading    | `AsyncImage` in lazy stacks                                        | An image loading library in lazy lists            | `Image.network` with a cache package                | Deferred loading in virtualised lists               |
| Accessible name | `accessibilityLabel`; `.accessibilityHidden(true)` when decorative | `contentDescription`; `null` when decorative      | `semanticLabel`; `ExcludeSemantics` when decorative | `AutomationProperties.Name`                         |

On native platforms prefer the system icon set: it matches the system text weight, scales with the user's text size, and mirrors for right-to-left on its own. The app icon and splash screen follow each platform's own size and safe-zone templates.

## 10. Checklist

- One icon set, one stroke weight, `currentColor`.
- Icon sizes from the four tokens; icon-only controls have a name and a 44 px target.
- Imagery from the highest available rung; no hotlinked stock, no invented assets.
- One aspect ratio per grid; frames fixed; crops checked.
- Modern formats, sized to display, compressed.
- Intrinsic dimensions on every image; lazy below the fold.
- Alt text written by purpose.
- Text over images has a guaranteed contrast layer.
