const global = (theme) => ({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  body: {
    overflowX: 'hidden',
    backgroundImage: 'url("https://i.imgur.com/PLrDHOb.png")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroudnPosition: 'center',
    color: theme.colors.black[0],
    fontFamily: theme.fontFamily,
  },
});

export default global;
