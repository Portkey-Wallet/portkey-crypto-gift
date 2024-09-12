export const sleep = (time: number) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(true);
      clearTimeout(timer);
    }, time);
  });
};

/**
 * this function is to format address,just like "formatStr2EllipsisStr" ---> "for...ess"
 * @param address
 * @param digit
 * @param type
 * @returns
 */
export const formatStr2EllipsisStr = (address = '', digit = 8, type: 'middle' | 'tail' = 'middle'): string => {
  if (!address) return '';

  const len = address.length;

  if (type === 'tail') return len > digit ? `${address.slice(0, digit)}...` : address;

  if (len < 2 * digit) return address;
  const pre = address.substring(0, digit);
  const suffix = address.substring(len - digit);
  return `${pre}...${suffix}`;
};

export const formatAelfAddress = (address = ''): string => {
  if (!address) return '';

  const pre = 'ELF_';
  const suffix = '_AELF';
  return `${pre}${address}${suffix}`;
};

export const isInPortkeyTgBot = () => {
  return window.location.hostname.includes('tgbot');
};
