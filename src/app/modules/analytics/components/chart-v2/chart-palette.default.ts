const chartPalette = {
  segmentColorIds: [
    // Colors for up to 6 segments
    'm-blue',
    'm-grey-160',
    'm-amber-dark',
    'm-green-dark',
    'm-red-dark',
    'm-blue-grey-500',
  ],
  themeMaps: [
    {
      id: 'm-white',
      themeMap: ['#fff', '#232323'],
    },
    {
      id: 'm-grey-50',
      themeMap: ['rgba(232,232,232,1)', 'rgba(47,47,47,1)'], // 222
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
      themeMap: ['#4690df', '#5db6ff'], // 44aaff
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
      id: 'm-blue-grey-500',
      themeMap: ['#607d8b', '#6b8a99'], // 607d8b
    },
  ],
};

export default chartPalette;
