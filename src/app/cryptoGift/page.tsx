'use client';
import clsx from 'clsx';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  DIDWalletInfo,
  SignIn,
  ISignIn,
  PortkeyProvider,
  singleMessage,
  did,
  ConfigProvider,
} from '@portkey/did-ui-react';
import { useCopyToClipboard } from 'react-use';
import BaseImage from '@/components/BaseImage';
import portkeyLogoBlack from '/public/portkeyLogoBlack.svg';
import styles from './page.module.scss';
import {
  referralDiscover,
  sloganReference,
  sloganInviteeCreate,
  sloganInviteeCreateMobile,
  sloganInviteeExist,
  sloganInviteeExistMobile,
  sloganInviteeDefault,
  sloganInviteeDefaultMobile,
  bgLine1,
  bgLine2,
  bgLine3,
  bgPortkeyLogo,
  boxCannotClaimed,
  portkeyLogo,
  logoutIcon,
  cryptoSuccess,
  cryptoShare,
} from '@/assets/images';
import { portkeyDownloadPage, privacyPolicy, termsOfService } from '@/constants/pageData';
import IOSDownloadBtn from '@/components/DownloadButtons/IOSDownloadBtn';
import AndroidDownloadBtn from '@/components/DownloadButtons/AndroidDownloadBtn';
import '@portkey/did-ui-react/dist/assets/index.css';
import { openWithBlank } from '@/utils/router';
import { useSearchParams } from 'next/navigation';
import { CMS_API, PORTKEY_API, cmsGet, portkeyGet } from '@/utils/axios/index';
import { isPortkey, isBrowser } from '@/utils/portkey';
import { ApiHost, BackEndNetWorkMap, CurrentNetWork, DomainHost } from '@/constants/network';
import { devices } from '@portkey/utils';
import OpenInBrowser from '@/components/OpenInBrowser';
import { detectBrowserName } from '@portkey/onboarding';
import { BackEndNetworkType } from '@/types/network';
import { StaticImageData } from 'next/image';
import { Dropdown, MenuProps } from 'antd';
import BreakWord from '@/components/BreakWord';

ConfigProvider.setGlobalConfig({
  graphQLUrl: '/graphql',
  serviceUrl: ApiHost,
  requestDefaults: {
    baseURL: ApiHost,
  },
});

const Referral: React.FC = () => {
  const [isShowMask, setIsShowMask] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);
  const [androidStoreUrl, setAndroidStoreUrl] = useState('');
  const [iOSStoreUrl, setIOSStoreUrl] = useState('');
  const [isPortkeyApp, setIsPortkeyApp] = useState<boolean>(true);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const signInRef = useRef<ISignIn>(null);
  const searchParams = useSearchParams();
  const [src, setSrc] = useState<StaticImageData>();
  const networkType = searchParams.get('networkType') || '';
  const cryptoGiftId = searchParams.get('id') || '';

  useEffect(() => {}, []);

  useEffect(() => {
    const nodeInfo = BackEndNetWorkMap[networkType as BackEndNetworkType] || CurrentNetWork;

    ConfigProvider.setGlobalConfig({
      graphQLUrl: `${networkType && nodeInfo ? `${window.location.origin}/${networkType}/graphql` : '/graphql'}`,
      serviceUrl: nodeInfo?.domain || nodeInfo?.apiUrl || DomainHost,
      requestDefaults: {
        baseURL: networkType && nodeInfo ? `${window.location.origin}/${networkType}` : '',
      },
    });
  }, [networkType]);

  useEffect(() => {
    if (detectBrowserName() === 'WeChat') {
      setIsShowMask(true);
      return;
    }
    // device
    const isMobile = devices.isMobile().tablet || devices.isMobile().phone;
    const isIOS = devices.isMobile().apple.device;
    const isAndroid = devices.isMobile().android.device;
    setIsMobile(isMobile);
    setIsIOS(isIOS);
    setIsAndroid(isAndroid);

    // portkey app
    const isPortkeyApp = isPortkey();
    setIsPortkeyApp(isPortkeyApp);

    if (isPortkeyApp) {
      singleMessage.error({
        duration: 0,
        content: 'Please open the link in browser or scan the code using camera.',
        onClose: () => null,
        onClick: () => null,
      });
    }
  }, []);

  did.setConfig({
    referralInfo: {
      projectCode: '200000',
    },
  });

  const onSignUp = () => {
    console.log('singup');
    signInRef.current?.setOpen(true);
  };

  const onCancel = useCallback(() => signInRef.current?.setOpen(false), [signInRef]);

  const onFinish = useCallback(async (didWallet: DIDWalletInfo) => {
    console.log('didWallet', didWallet);
    setIsSignUp(true);
    setIsNewAccount(didWallet.createType === 'register');

    const downloadResource = await cmsGet(CMS_API.GET.DOWNLOAD);
    setAndroidStoreUrl(downloadResource?.data?.androidDownloadUrl || '');
    setIOSStoreUrl(downloadResource?.data?.iosDownloadUrl || '');
  }, []);


  const onDownload = useCallback(() => {
    openWithBlank(portkeyDownloadPage);
  }, []);

  const onCopyClick = useCallback(() => {
    copyToClipboard('XXX');
    copyState.error ? singleMessage.error(copyState.error.message) : copyState.value && singleMessage.success('Copied');
  }, [copyState.error, copyState.value, copyToClipboard]);

  useEffect(() => {
    const isInMobile = !isBrowser() || isMobile;
    let sourceUri = sloganReference;

    // default
    if (!isSignUp && !isInMobile) {
      sourceUri = sloganInviteeDefault;
    }
    if (!isSignUp && isInMobile) sourceUri = sloganInviteeDefaultMobile;

    // registered
    if (isSignUp && !isInMobile) sourceUri = sloganInviteeCreate;
    if (isSignUp && isNewAccount && isInMobile) sourceUri = sloganInviteeCreateMobile;

    // others
    if (isSignUp && !isNewAccount && !isInMobile) sourceUri = sloganInviteeExist;
    if (isSignUp && !isNewAccount && isInMobile) sourceUri = sloganInviteeExistMobile;

    setSrc(sourceUri);
  }, [isMobile, isNewAccount, isSignUp]);

  const SloganDOM = useMemo(() => {
    if (!src) return <div style={{ height: 100 }} />;

    return (
      <div className={styles.sloganWrapper}>
        <BaseImage src={src} alt={src.src} height={100} />
      </div>
    );
  }, [src]);

  const InviteeChapterDom = useMemo(() => {
    if (!isSignUp)
      return (
        <div className={styles.inviteeText}>
          <span className={styles.row2}>{`Seize the opportunity.`}</span>
          <span className={styles.row2}>{` Expect upcoming surprises!`}</span>
        </div>
      );

    if (isNewAccount)
      return (
        <div className={styles.inviteeText}>
          <span>{`You have signed up on Portkey successfully!`}</span>
        </div>
      );

    return (
      <div className={styles.inviteeText}>
        <div>
          <span className={styles.row2}>{`This is an existing account and can't`}</span>
          <span className={styles.row2}>{` accept invitation.`}</span>
        </div>
        <div>
          <span className={styles.row2}>{`You can access your own Portkey and`}</span>
          <span className={styles.row2}>{` experience Web3 now!`}</span>
        </div>
      </div>
    );
  }, [isNewAccount, isSignUp]);

  const dropDownItems: MenuProps['items'] = useMemo(
    () => [
      {
        key: '1',
        label: 'Log Out',
        icon: <BaseImage src={logoutIcon} alt={'logout'} width={16} height={16} />,
        onclick: () => {
          console.log('log out !!');
        },
        styles: { color: 'red' },
      },
    ],
    [],
  );

  const CryptoBoxHeaderDom = useMemo(
    () => (
      <>
        <BaseImage src={referralDiscover} className={styles.cryptoGiftSenderImg} alt="bgLines" priority />
        <div className={styles.cryptoGiftSenderTitle}>Rachel Wei sent to you a Crypto Gift</div>
        <div className={styles.cryptoGiftSenderMemo}>Best wishes!</div>
      </>
    ),
    [],
  );

  const CryptoBoxImgDom = useMemo(
    () => (
      <BaseImage
        src={boxCannotClaimed}
        className={styles.cryptoGiftImg}
        alt="bgLines"
        priority
        width={343}
        height={240}
      />
    ),
    [],
  );
  const CryptoGiftTipsDom = useMemo(
    () => (
      <div className={styles.cryptoGiftTips}>
        Sorry, you miss the claim expiration time.Sorry, you miss the claim expiration time.Sorry, you miss the claim
        expiration time.Sorry, you miss the claim expiration time.Sorry, you miss the claim expiration time.
      </div>
    ),
    [],
  );

  const ActionButtonDom = useMemo(() => {
    return (
      <>
        <div className={clsx(isMobile && styles.mobileClaimBtn)}>
          <button className={styles.claimBtn} onClick={onSignUp}>
            Sign up
          </button>
        </div>
        <p className={styles.btnTips}>Claim to your Portkey address</p>
      </>
    );
  }, [isMobile]);

  const DownLoadDom = useMemo(() => {
    return (
      <div className={styles.downloadWrap}>
        <BaseImage className={styles.portkeyLogo} src={portkeyLogo} priority alt="portkeyLogo" />
        <div className={styles.downloadTips}>Download and signup to claim more Crypto Gift!</div>
        <div className={styles.downloadBtn}>Download</div>
      </div>
    );
  }, []);

  const GiftDetailDom = useMemo(() => {
    return (
      <div className={styles.giftDetailWrap}>
        <div className={styles.willGet}>You will get</div>
        {isAndroid ? (
          <>
            <div className={styles.symbol}>0.000008</div>
            <div className={styles.usdtAmount}>=$12321223</div>
          </>
        ) : (
          <>
            <div className={styles.nftWrap}>
              <BaseImage
                className={styles.nftItem}
                src={portkeyLogo}
                priority
                alt="portkeyLogo"
                width={98}
                height={98}
              />
              <p className={styles.nftName}>WitchyBean</p>
              <p className={styles.nftId}>#2</p>
            </div>
            <div className={styles.nftCount}>0.000008</div>
          </>
        )}
        <div className={styles.alarmWrap}>
          <BaseImage src={portkeyLogo} priority alt="portkeyLogo" width={14} height={14} />
          <p className={styles.alarmText}>Expiration: 19:56</p>
        </div>
      </div>
    );
  }, [isAndroid]);

  const SuccessFullDom = useMemo(() => {
    return (
      <div className={styles.successSectionWrap}>
        <BaseImage
          src={boxCannotClaimed}
          className={styles.cryptoGiftImg}
          alt="cryptoGiftImg"
          priority
          width={343}
          height={240}
        />
        <div className={styles.successWrap}>
          <BaseImage src={cryptoSuccess} alt="cryptoSuccess" priority width={20} height={20} />
          <BreakWord className={styles['amount-symbol']} text={`100 ELF 100 ELF 100 ELF 100 ELF 100 ELF`} />
          <BreakWord className={styles.toAddress} text={`has sent to your address`} />
        </div>
        <button className={styles.viewDetails}>View Details</button>
        <button className={styles.shareBtnWrap}>
          <BaseImage src={cryptoShare} alt="cryptoShare" priority width={20} height={20} />
          <p className={styles.buttonText}>Share with your friends</p>
        </button>
      </div>
    );
  }, []);

  return (
    <div className={styles.referralPage}>
      <div className={styles.referralBlueContainer}>
        <header className="row-center">
          <div className={clsx(['flex-row-center', styles.referralHeader])}>
            <BaseImage className={styles.portkeyLogo} src={portkeyLogoBlack} priority alt="portkeyLogo" />

            <Dropdown overlayClassName="logout-drop-down" trigger={['click']} menu={{ items: dropDownItems }}>
              <BaseImage
                className={styles.userLogo}
                src={portkeyLogo}
                priority
                alt="portkeyLogo"
                width={24}
                height={24}
              />
            </Dropdown>
          </div>
        </header>
        <div className={styles.referralMainContainer}>
          <div className={styles.bgWrap}>
            <BaseImage src={bgPortkeyLogo} className={styles.bgPortkeyLogo} alt="bgLines" priority />
            <BaseImage src={bgLine1} className={styles.bgLine1} alt="bgLines" priority />
            <BaseImage src={bgLine2} className={styles.bgLine2} alt="bgLines" priority />
            <BaseImage src={bgLine3} className={styles.bgLine3} alt="bgLines" priority />
          </div>

          {CryptoBoxHeaderDom}
          {CryptoBoxImgDom}
          {CryptoGiftTipsDom}
          {ActionButtonDom}
          {GiftDetailDom}
          {SuccessFullDom}
          {DownLoadDom}
          {/* <BaseImage src={referralColorBox} className={styles.bgColorBox} alt="bgColorBox" priority /> */}
        </div>
      </div>

      {!isPortkeyApp && (
        <PortkeyProvider networkType={CurrentNetWork.networkType}>
          <SignIn
            className={styles['invitee-sign-in']}
            defaultLifeCycle={{
              SignUp: undefined,
            }}
            termsOfService={termsOfService}
            privacyPolicy={privacyPolicy}
            uiType="Modal"
            ref={signInRef}
            onFinish={onFinish}
            onCancel={onCancel}
          />
        </PortkeyProvider>
      )}

      {/* mask */}
      {isShowMask && <OpenInBrowser />}
    </div>
  );
};

export default Referral;
