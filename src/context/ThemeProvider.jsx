import React from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme } from "@/config/theme";
import PropTypes from "prop-types";

export const ThemeProvider = ({ children }) => {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
