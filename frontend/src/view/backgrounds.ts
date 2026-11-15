// Built-in wallpapers. The full set of 10 comes later; these three match the mockups.
export const BACKGROUNDS: Record<string, string> = {
  crepusculo:
    "radial-gradient(120% 60% at 0% 0%, #54407f 0%, rgba(84,64,127,0) 60%), radial-gradient(90% 60% at 100% 40%, #3e4f8c 0%, rgba(62,79,140,0) 70%), radial-gradient(100% 60% at 0% 85%, #2f6f8f 0%, rgba(47,111,143,0) 70%), linear-gradient(180deg, #3b3f73 0%, #34497e 55%, #2e5a86 100%)",
  terral:
    "radial-gradient(120% 70% at 10% 0%, #c9774a 0%, rgba(201,119,74,0) 60%), radial-gradient(100% 60% at 100% 35%, #8a4f6e 0%, rgba(138,79,110,0) 65%), linear-gradient(180deg, #5a3550 0%, #3a2b4a 60%, #22243f 100%)",
  mar:
    "radial-gradient(120% 60% at 0% 0%, #2d8ca3 0%, rgba(45,140,163,0) 60%), radial-gradient(100% 70% at 100% 60%, #1f5f8f 0%, rgba(31,95,143,0) 70%), linear-gradient(180deg, #14476b 0%, #0f3556 60%, #0b2540 100%)",
};

export function backgroundCss(value?: string): string {
  if (!value) return BACKGROUNDS.crepusculo;
  if (BACKGROUNDS[value]) return BACKGROUNDS[value];
  // Anything that looks like an image URL is used as a cover photo.
  if (/^(https?:|\/|data:image)/.test(value)) return `center / cover no-repeat url("${value.replace(/"/g, "%22")}")`;
  return value;
}
