# Copilot Instructions

## Root README.md

The root README.md file is included in the Association website [here](https://cloud-native-romandy.ch/kcd2026/).
This website is implemented using MkDocs and Material for MkDocs.
Any edits should strictly follow the GitHib Flavoured Markdown specification.
Minimize injections of styling and complex HTML.

## 2025 information sources

For the KCD Suisse Romande 2025 context and information, the information can be retrieved from here:

- [Website on Bevy](https://community2.cncf.io/events/details/cncf-kcd-suisse-romande-presents-kcd-suisse-romande/)
- [Archive Repository](https://github.com/cloud-native-suisse-romande/kcd-suisse-romande-2025)


## Website on Bevy Cache

The website on Bevy is cached as raw HTML in the `.cache` directory as [KCD Cache](../.cache/kcd_page.html).
This HTML, if exists, can be used to extract the necessary information from the website, including image URLs.
If the file does not exist, the information can be retrieved from the live website on Bevy.

## Sponsors and Community Partners

Logos are stored in the "images/sponsors/" directory.
Texts and metadata are stored in the "sponsors.md" file.
There is also a sponsor listing in the main README.md file.

When adding a new sponsor, please ensure that the sponsor is added to both the "sponsors.md" file and the main README.md file. 
Sponsors should be added to the end.

For sponsor images, use PNG files with white background when possible.
If the PNG has a transparent background, it should be modified to have a white background.
When adding a new sponsor, verify the logo background first and convert any transparent logo to a white-background PNG before referencing it in `sponsors.md` and `README.md`.

## Markdown styles

The content will be rendered in the Material for MkDocs theme, which has its own styling. Stick to the default Markdown styles and avoid using custom HTML or CSS unless necessary. Use GitHub Flavored Markdown for as a default standard.

When adding rows to the tables, start them from a new line.
