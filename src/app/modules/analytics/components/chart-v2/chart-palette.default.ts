const chartPalette = {
  segmentColorIds: [
    // Colors for up to 6 segments
    'm-blue',
    'm-grey-160',
    'm-amber-dark',
    'm-green-dark',
    'm-red-dark',
    'm-grey-500',
  ],
  themeMaps: [
    {
      id: 'm-bgColor--primary',
      themeMap: ['#ffffff', '#1c1d1f'],
    },
    {
      id: 'm-borderColor--primary',
      themeMap: ['#d3dbe3', '#53565a'],
    },
    {
      id: 'm-borderColor--secondary',
      themeMap: ['#E7EFF7', '#494c50'], // m- borderColor--primary + /- 8%
    },
    {
      id: 'm-textColor--tertiary',
      themeMap: ['#9b9b9b', '#a1a5ab'],
    },
    {
      id: 'm-white',
      themeMap: ['#fff', '#232323'],
    },
    {
      id: 'm-grey-70',
      themeMap: ['#eee', '#404040'], // 333 before 5% lighten
    },
    {
      id: 'm-grey-130',
      themeMap: ['#ccc', '#515151'], // 444
    },
    {
      id: 'm-grey-160',
      themeMap: ['#bbb', '#626262'], // 555
    },
    {
      id: 'm-grey-300',
      themeMap: ['#999', '#737373'], // 666
    },
    {
      id: 'm-blue',
      themeMap: ['#1b85d6', ' #ffd048'], // 44aaff
    },
    {
      id: 'm-red-dark',
      themeMap: ['#c62828', '#e98989'], // e57373
    },
    {
      id: 'm-amber-dark',
      themeMap: ['#ffa000', '#fff2cc'], // ffecb3
    },
    {
      id: 'm-green-dark',
      themeMap: ['#388e3c', '#97c95d'], // 8bc34a
    },
    {
      id: 'm-grey-500',
      themeMap: ['#607d8b', '#6b8a99'], // 607d8b
    },
  ],
};

export default chartPalette;
