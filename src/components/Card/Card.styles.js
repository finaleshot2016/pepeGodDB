import { createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  card: {
    padding: 20,
    backgroundImage: 'url("https://i.imgur.com/9GRkKW1.png")',
    backdropFilter: 'blur(1000px)',
    border: '3px solid #26a69a',
    borderRadius: 14,
  },
}));

export default useStyles;
