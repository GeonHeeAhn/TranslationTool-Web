import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Container>
      <Link to="/mypage">
        <ProfileIcon>
          <img
            src={process.env.PUBLIC_URL + '/design/person_icon.png'}
            alt="profile icon"
            style={{ height: '30px', width: '30px' }}
          />
        </ProfileIcon>
      </Link>
    </Container>
  );
};

export default Header;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  height: 40px;
  position: absolute;
  top: 0;
`;

const ProfileIcon = styled.div`
  margin-top: 10px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
`;
