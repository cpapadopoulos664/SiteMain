# Professional Developer Portfolio

A modern, responsive portfolio website with impressive hover effects and smooth animations. Built with HTML5, CSS3, and vanilla JavaScript.

## Features

- Clean black and white theme
- Responsive design
- Modern hover effects and animations
- Glitch text effect
- Smooth page transitions
- Optimized for GitHub Pages

## Structure

```
├── index.html
├── css/
│   ├── style.css
│   └── animations.css
├── js/
│   └── main.js
├── pages/
│   ├── bio.html
│   ├── education.html
│   ├── projects.html
│   ├── hobbies.html
│   └── contact.html
└── images/
    └── profile.jpg
```

## Setup Instructions

1. Clone this repository or download the files
2. Replace `images/profile.jpg` with your profile picture
3. Edit the content in each HTML file to add your personal information
4. If hosting on GitHub Pages:
   - Create a new repository named `username.github.io`
   - Push these files to that repository
   - Your site will be available at `https://username.github.io`

## Customization

### Colors
The color scheme can be modified in `css/style.css` by changing the CSS variables:

```css
:root {
    --primary-color: #ffffff;
    --secondary-color: #000000;
    --accent-color: #333333;
    --transition-speed: 0.3s;
}
```

### Content
Each page (bio.html, education.html, etc.) follows the same structure. To add your content:

1. Replace the placeholder text in each file
2. Add your own images to the `images/` directory
3. Update image paths in the HTML files
4. Modify the grid layouts and styling as needed

### Adding New Sections
To add a new section:

1. Copy one of the existing page templates from the `pages/` directory
2. Update the content and styling as needed
3. Add a new navigation item to `index.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for your personal portfolio! 