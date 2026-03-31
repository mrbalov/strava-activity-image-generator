# Change: Add Strava footer button

## Why
The website needs a visible link to the Strava club (https://www.strava.com/clubs/torqlab) in the footer to help users discover and join the community. A minimalist icon button matching existing footer icons provides consistent UX while maintaining footer clean aesthetics.

## What Changes
- Add Strava icon to icon library (or use provided SVG if not available)
- Add new icon button to website footer linking to Strava club
- Configure button with security attributes (noopener, noreferrer)
- Ensure button opens link in new browser tab
- Style button to match existing footer icon button design

## Implementation Approach
1. Check existing icon library for Strava icon availability
2. If missing, add provided SVG to icon assets directory
3. Add Strava icon button component to Footer component
4. Apply consistent styling with other footer icon buttons
5. Add proper security attributes to anchor tag
6. Add accessible alt text and aria labels

## Impact
- **Affected files/components:**
  - Footer component (render new icon button)
  - Icon assets directory (add Strava SVG if needed)
  - Footer styling/CSS (ensure consistent appearance)
- **Change type:** Added (new button and icon)
- **User impact:** Users can access Strava club from website footer
- **Security:** Proper security attributes prevent referrer leaks
