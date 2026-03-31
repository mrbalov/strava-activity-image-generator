# Footer Social Button Specification

## ADDED Requirements

### Requirement: Strava Club Link Button
Adds a clickable footer button that links to the TORQ Strava club with consistent styling and security considerations.

#### Scenario: User clicks Strava button
- **WHEN** user clicks the Strava icon button in the footer
- **THEN** https://www.strava.com/clubs/torqlab opens in a new browser tab
- **AND** the link includes `noopener` and `noreferrer` attributes for security
- **AND** the original page remains visible in the current tab

#### Scenario: Button visual consistency
- **WHEN** the page renders the footer
- **THEN** the Strava button appears with the same square icon button styling as other footer social icons
- **AND** the Strava icon is minimalistic and clearly recognizable
- **AND** the button hover state matches existing footer icon buttons

#### Scenario: Icon availability
- **WHEN** the icon library contains a Strava icon
- **THEN** use the existing icon from the library
- **OTHERWISE** use the provided SVG from the issue description
