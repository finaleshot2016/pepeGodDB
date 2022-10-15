import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import otoAbi from '../utils/otoAbi.json';
import wavaxAbi from '../utils/wavaxAbi.json';
import { useLocation } from 'react-router-dom';

const EtherContext = React.createContext();

const defaultDashboardData = {
  avaxPrice: 0,
  price: 0,
  marketCap: 0,
  // holders: 0,
  rewards: 0,
  totalSupply: 0,
  circulatingSupply: 0,
  AVAXliq: 0,
  firepitPercentage: 0,
  distributed: 0,
  distributedUSD: 0,
  DEVETH: 0,
};

const defaultWalletData = {
  balance: 0,
  balanceInUSD: 0,
  AVAXbalance: 0,
  AVAXbalanceInUSD: 0,

};

export const EtherContextProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(defaultDashboardData);      
  const [walletData, setWalletData] = useState(defaultWalletData);                        
  const [user, setUser] = useState(() => {
    const stickyValue = sessionStorage.getItem('user');
    return stickyValue !== null ? JSON.parse(stickyValue) : null;
  });

  const avaxProvider = useMemo(() => new ethers.providers.getDefaultProvider('https://mainnet.infura.io/v3/612bc69b6c6d4bed9563cc131c039427'), []);
  const otoContract = useMemo(() => new ethers.Contract('0x4c57dFF92DB3cBB7071E8159960A3b2c488d33C7', otoAbi, avaxProvider), [avaxProvider]);
  const wavaxContract = useMemo(() => new ethers.Contract('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', wavaxAbi, avaxProvider), [avaxProvider]);
  const lpPair = '0x0DD5B33Bbcbab5Ff92B442F83A0E007a0A583E12';
  const tokenDecimal = 9;
  const devwallet = '0x491B9e3F5e4EFFB21F7ef365539fae1Ba09f8589';

  const location = useLocation();

  const tokenFormatEther = (value) => {
    return ethers.utils.formatUnits(value, tokenDecimal);
  };


  // Dashboard
  const getAvaxPrice = useCallback(async () => {
    const response = await fetch('https://api.coinstats.app/public/v1/coins/ethereum');
    const data = await response.json();
    const avaxPrice = data.coin.price;

    return avaxPrice.toFixed(2);
  }, []);

  const getLPBalance = useCallback(async () => {
    const avaxBalance = await wavaxContract.balanceOf(lpPair);
    const tokenBalance = await otoContract.balanceOf(lpPair);

    return {
      avax: ethers.utils.formatUnits(avaxBalance, 18),
      token: tokenFormatEther(tokenBalance),
    };
  }, [wavaxContract, otoContract]);

  const getTokenPrice = useCallback((lpAvax, lpToken, avaxPrice) => {
    if (lpAvax && lpToken && avaxPrice) {
      const avaxBalanceInUsd = lpAvax * avaxPrice;
      const tokenPrice = (avaxBalanceInUsd / lpToken);
      return tokenPrice;
    }
  }, []);

 
  const getMarketCap = useCallback(
    async (otoPrice) => {
      let totalSupply = await otoContract.totalSupply();

      let marketCap = parseFloat(tokenFormatEther(totalSupply)) * otoPrice; 
      const numberFormatter = Intl.NumberFormat('en-US');
      return numberFormatter.format(marketCap.toFixed(2));
    },
    [otoContract]
  );



  const getTotalSupply = useCallback(
    async (otoPrice) => {
      const totalSupply = 1000000.00;
      const numberFormatter = Intl.NumberFormat('en-US');
      return numberFormatter.format(totalSupply.toFixed(2));
    },
    []
  );

  const getCircSupply = useCallback(async () => {
    let totalSupply1 = await otoContract.totalSupply();
    let circSupply = tokenFormatEther(totalSupply1);

    return parseFloat(circSupply);
  }, [otoContract]);

  const getCirculatingSupply = useCallback(async () => {
    let totalSupply = await otoContract.totalSupply();
    let circulatingSupply = parseFloat(tokenFormatEther(totalSupply)).toFixed(2);
    const numberFormatter = Intl.NumberFormat('en-US');
    return numberFormatter.format(parseFloat(circulatingSupply).toFixed(2));
  }, [otoContract]);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const user = await signer.getAddress();

    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };                                             

  const getAccountBalance = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const balance = await otoContract.balanceOf(address);
      return parseFloat(tokenFormatEther(balance)).toFixed(5);
    },
    [otoContract]
  );
 
  const getDEVETH = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const AVAXbalance = await avaxProvider.getBalance(address);
      const AVAXbalanceDEV = parseFloat(ethers.utils.formatUnits(AVAXbalance, 18)).toFixed(3);
      return (AVAXbalanceDEV/2 - 5.5).toFixed(3);
    },
    [avaxProvider]
  );  

  
  const getAVAXBalance = useCallback(
    async (address) => {
      if (!address) {
        return;
      }
      const AVAXbalance = await avaxProvider.getBalance(address);
      return parseFloat(ethers.utils.formatUnits(AVAXbalance, 18)).toFixed(3);
    },
    [avaxProvider]
  );  

  // Account
  const calculateWallet = useCallback(async () => {
    const balance = await getAccountBalance(user);



    const balanceInUSD = (balance * dashboardData.price).toFixed(3);
    const AVAXbalance = await getAVAXBalance(user);
    const AVAXbalanceInUSD = (AVAXbalance * dashboardData.avaxPrice).toFixed(3);

    setWalletData((prevData) => ({
      balance, balanceInUSD, AVAXbalance, AVAXbalanceInUSD
    }));
  }, [getAccountBalance, dashboardData.price, dashboardData.avaxPrice, user, getAVAXBalance]);

  useEffect(() => {
    if (user) {
      calculateWallet(user);
    }
  }, [user, location.pathname, calculateWallet]);


  // On page load
  const fetchData = useCallback(async () => {
    const avaxPrice = await getAvaxPrice();
    const lpBalance = await getLPBalance();
 const DEVETH = await getDEVETH(devwallet)
    const otoPrice = getTokenPrice(lpBalance.avax, lpBalance.token, avaxPrice);
    const marketCap = await getMarketCap(otoPrice);
    const numberFormatter = Intl.NumberFormat('en-US');
    const AVAXliq = numberFormatter.format(getTokenPrice(lpBalance.avax, 1, avaxPrice).toFixed(2));
    const totalSupply = await getTotalSupply();
    const circulatingSupply = await getCirculatingSupply();
    const circSupply = await getCircSupply();

    setDashboardData({avaxPrice, price: otoPrice, marketCap, totalSupply, AVAXliq, circulatingSupply, circSupply, DEVETH});
  }, [getAvaxPrice, getLPBalance, getTokenPrice, getMarketCap, getTotalSupply, getCirculatingSupply, getCircSupply, getDEVETH]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  return (
    <EtherContext.Provider value={{ dashboardData, walletData, connectWallet, user}}>
      {children}
    </EtherContext.Provider>
  );
};

export default EtherContext;
