import React from "react";
import { Global, css } from "@emotion/react";

export const GlobalStyles = () => (
  <Global
    styles={css`
      @media (min-width: 480px) {
        html {
          font-size: 16px;
        }
      }
      @media (min-width: 768px) {
        html {
          font-size: 17px;
        }
      }
      @media (min-width: 992px) {
        html {
          font-size: 18px;
        }
      }
      @media (min-width: 1280px) {
        html {
          font-size: 18px;
        }
      }
      @media (min-width: 1536px) {
        html {
          font-size: 18px;
        }
      }
    `}
  />
);
