export const strings = {
  stringLimiter: (string: string, maxLength: number) => {
    if(string) {
      if (string.length <= maxLength) {
        return string;
      }
      return `${string.substring(0, maxLength)}...`;
    }
    
    return '';
  }
}