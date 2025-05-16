import styled from "styled-components";

export const theme = {
    colors: {
        primary: '#3498db',
        primaryHover: '#005b99',
        secondary: '#f9f9f9',
        background: '#f0f8ff',
        areaBackground: '#f9f9f9',
        textLight: '#ffffff',
        border: '#003366',
        danger: '#cc0000',
        warning: '#f39c12',
        success: '#2ecc71',
    }
}

export const AreaDiv = styled.div`
    border: 2px solid ${theme.colors.border};
    border-radius: 10px;
    padding: 10px;
    background-color: ${theme.colors.areaBackground};
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    width: 120px;
    height: 120px;
`;

export const ActionButton = styled.button`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.textLight};
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`;