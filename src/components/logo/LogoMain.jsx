// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Mantis" width="100" />
     *
     */
    <>
     <svg width="118" height="35" viewBox="0 0 118 35" fill="none" xmlns="http://www.w3.org/2000/svg"><image href="data:image/png;base64,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" height="100%" width="100%"/></svg>
    </>
  );
};

export default Logo;


