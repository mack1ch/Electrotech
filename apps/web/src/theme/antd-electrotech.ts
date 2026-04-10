import type { ThemeConfig } from 'antd';

/**
 * Токены под макет Figma (поиск / фильтры 0:1189 и связанные экраны).
 * Inter задаётся на body через --font-inter.
 */
export const electrotechAntTheme: ThemeConfig = {
  token: {
    colorPrimary: '#264b82',
    colorText: '#0a0a0a',
    colorTextSecondary: '#4a5565',
    colorTextPlaceholder: '#a7a7a7',
    colorTextQuaternary: 'rgba(10,10,10,0.4)',
    colorBgContainer: '#ffffff',
    colorFillSecondary: '#f9fafb',
    colorFillTertiary: '#efefef',
    borderRadius: 4,
    borderRadiusLG: 10,
    fontSize: 16,
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    controlHeightLG: 50,
    controlHeight: 44,
    lineHeight: 1.25,
    lineHeightLG: 1.25,
  },
  components: {
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      fontWeight: 600,
      controlHeightLG: 53,
      paddingContentHorizontal: 24,
    },
    Input: {
      colorBgContainer: '#f9fafb',
      activeBorderColor: '#264b82',
      hoverBorderColor: '#264b82',
      paddingBlockLG: 12,
      paddingInlineLG: 16,
    },
    InputNumber: {
      colorBgContainer: 'transparent',
    },
    Select: {
      colorBgContainer: 'transparent',
      optionSelectedBg: '#e5efff',
    },
    Radio: {
      radioSize: 16,
      dotSize: 8,
    },
    Checkbox: {
      borderRadiusSM: 2.5,
    },
    Slider: {
      railSize: 4,
      trackBg: '#264b82',
      trackHoverBg: '#1a3a66',
      railBg: '#e5e5e5',
      handleSize: 14,
      handleActiveColor: '#264b82',
      handleColor: '#264b82',
    },
    Form: {
      labelFontSize: 16,
      verticalLabelPadding: '0 0 8px',
      itemMarginBottom: 32,
    },
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
      borderRadiusLG: 10,
    },
    Drawer: {
      paddingLG: 22,
      paddingMD: 22,
    },
    Breadcrumb: {
      itemColor: '#4a5565',
      linkColor: '#4a5565',
      linkHoverColor: '#264b82',
      lastItemColor: '#264b82',
      separatorColor: '#4a5565',
      fontSize: 14,
    },
    DatePicker: {
      colorBgContainer: '#f9fafb',
      activeBorderColor: '#264b82',
      hoverBorderColor: '#264b82',
    },
    Pagination: {
      itemActiveBg: '#e5efff',
    },
  },
};
