export const productMarketingMockData = {
  attributes: {
    hero: {
      h1: 'h1',
      body: 'body',
      showBackgroundEffects: true,
      image: {
        data: {
          attributes: {
            url: '/image.jpeg',
          },
        },
      },
    },
    sections: [
      {
        title: 'Section Title',
        body: 'Section Body',
        image: {
          data: {
            attributes: {
              url: 'https://minds.com/section-image.png',
            },
          },
        },
        imageOverlay: {
          data: {
            attributes: {
              url: 'https://minds.com/section-image-overlay.png',
            },
          },
        },
        actionButtons: [
          {
            text: 'Action Text',
            action: 'open_composer',
            navigationUrl: null,
          },
        ],
        leftAligned: true,
        showBackgroundEffects: true,
        showBodyBackground: true,
      },
    ],
    otherFeaturesSection: {
      title: 'Other Features Title',
      column1Title: 'Column 1 Title',
      column1Body: 'Column 1 Body',
      column2Title: 'Column 2 Title',
      column2Body: 'Column 2 Body',
      column3Title: 'Column 3 Title',
      column3Body: 'Column 3 Body',
    },
    metadata: {
      title: 'Metadata Title',
      description: 'Metadata Description',
      canonicalUrl: 'https://minds.com',
      robots: 'index, follow',
      author: 'John Doe',
      ogUrl: 'https://minds.com',
      ogType: 'website',
      ogAuthor: 'John Doe',
      ogImage: {
        data: {
          attributes: {
            url: 'https://minds.com/og-image.png',
            height: 600,
            width: 600,
          },
        },
      },
    },
  },
};
