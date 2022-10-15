import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  btn: {
    height: 52,
    backgroundImage: 'url("https://i.imgur.com/aSHMXAs.png")',
    backgroundSize: '200% auto',
    fontSize: theme.fontSizes.md,
    textTransform: 'uppercase',
    borderRadius: 20,
    transition: theme.other.transitions.background,

    '&:hover': {
      backgroundPositionX: 'right',
      backgroundPositionY: 'center',
    },
  },
}));

export default useStyles;
