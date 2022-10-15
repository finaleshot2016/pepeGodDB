import React, { useContext } from 'react';
import { Title, Text, SimpleGrid } from '@mantine/core';
import EtherContext from '../../context/EtherContext';
import Card from '../../components/Card/Card';
import { ReactComponent as Price } from '../../assets/dashboard-price.svg';
import useStyles from './Dashboard.styles';


const Dashboard = () => {
  const { walletData, dashboardData } = useContext(EtherContext);
  const { classes } = useStyles();


  const row1 = [
    { icon: Price, title: 'Token Price', value: "$" + dashboardData.price.toFixed(5) },
    { icon: Price, title: 'PEPE Blessings', value: walletData.DEVETH + " ETH / 2 ETH" },
    { icon: Price, title: 'Market Cap', value: "$" +  dashboardData.marketCap },
  ];

  const row2 = [
    { icon: Price, title: 'TOKEN HOLDINGS', label: walletData.balance + " TOKEN" , value: "$" + walletData.balanceInUSD},
    { icon: Price, title: 'ETH HOLDINGS', label: walletData.AVAXbalance + " ETH" , value: "$" + walletData.AVAXbalanceInUSD},

  ];


  const row1List = row1.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));



  const row2List = row2.map((item) => (
    <Card key={item.title} className={classes.cardStat}>
      <item.icon className={classes.cardStatIcon} />
      <div>
        <Title className={classes.cardStatTitle} order={6}>
          {item.title}
        </Title>
        <Text className={classes.cardStatLabel} size="md">
          {item.label}
        </Text>
        <Text size="lg">{item.value}</Text>
      </div>
    </Card>
  ));



  return (
    <div>
       <Text size="lg">TOKEN</Text>
      <SimpleGrid className={classes.row} cols={3} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row1List}
      </SimpleGrid>
      <Text size="lg">ACCOUNT</Text>
      <SimpleGrid className={classes.row} cols={2} spacing={40} breakpoints={[{ maxWidth: 1024, cols: 1 }]}>
        {row2List}
      </SimpleGrid>
    </div>
  );
};

export default Dashboard;
