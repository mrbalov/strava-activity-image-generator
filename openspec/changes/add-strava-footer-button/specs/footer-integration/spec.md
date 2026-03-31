# Footer Integration Specification

## ADDED Requirements

### Requirement: Strava Club Social Link Button
Adds a new icon button to the website footer that links to the TORQ Strava club, allowing users to discover and join the community.

**WHEN** user visits the website footer
**THEN** user sees a Strava icon button alongside other social/community links
**AND** button is styled consistently with existing footer icon buttons
**AND** button label is accessible to screen readers

### Requirement: Security Attributes
Ensures the Strava link follows web security best practices by preventing referrer information leakage.

**WHEN** user clicks the Strava button
**THEN** link opens in a new browser tab
**AND** browser does not send HTTP referrer header to Strava
**AND** opened window has no access to window.opener (prevents window hijacking)

**Implementation details:**
- Use `target="_blank"` to open in new tab
- Use `rel="noopener noreferrer"` for security
  - `noopener`: Prevents opened window from accessing window.opener
  - `noreferrer`: Prevents sending HTTP referrer header

### Requirement: Icon Consistency
The Strava icon matches the minimalist design language of existing footer icons.

**WHEN** footer is displayed
**THEN** Strava icon is rendered at same size as other footer icons
**AND** Strava icon uses same color scheme (likely white or matching theme)
**AND** icon scales appropriately on responsive layouts

**Icon details:**
- SVG format (provided in issue if not in library)
- Minimalist design with stroke-based lines
- Square viewport (800x800px original, scales to button size)
- Colors adapt to footer theme

### Requirement: Accessibility
The Strava button is fully accessible to keyboard and screen reader users.

**WHEN** user navigates footer with keyboard
**THEN** Strava button receives focus like other buttons
**AND** user can activate button with Enter/Space key

**WHEN** screen reader reads footer
**THEN** Strava button has descriptive accessible name (e.g., "Visit TORQ on Strava, opens in new tab")
**AND** visual icon has appropriate aria-label

## REMOVED/CHANGED
None - this is purely additive
