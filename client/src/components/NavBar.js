import React, { useContext } from "react";
import { LogoutButton } from './LogoutButton';
import { NavBarItem } from './NavBarItem';
import { StateContext } from '../App';
import styled from "styled-components";
export function NavBar() {
  const [state] = useContext(StateContext);
  return <Nav>
    {state.isLoggedIn && <>
      <NavBarItem activeOnlyWhenExact={true} to="/home" label="Home" />
      <NavBarItem to="/myprofile" label={`@${state.profile.username}`} />
      <SearchBox />
      <LogoutButton />
    </>}
    {!state.isLoggedIn && <>
      <NavBarItem to="/login" label="Login" />
      <NavBarItem to="/signup" label="Sign Up" />
    </>}
  </Nav>;
}

const Nav = styled.nav`
display:flex;
align-items: center;
`;

const SearchInput = styled.input`

text-size-adjust: 100%;
margin: 0;
box-sizing: border-box;
border-radius: 0.6rem 0px 0px 0.6rem !important;
padding: 0.5rem !important;
font-size: 1.5rem  !important;
font-family: inherit;
appearance: none;
background-clip: padding-box;
line-height: 1.5;
border-style: solid;
border-width: 1px;
border-color: white;
color: white;
background-color: #ffffff33;
display: block;
width:30rem;
@media (max-width: 800px) {
  &{
    display:none;
  }
}
`;

const SearchButton = styled.button`
text-size-adjust: 100%;
margin: 0;
padding: 0;
box-sizing: border-box;
border: none;
text-align: inherit;
background: 0 0;
border-radius: 0;
font: inherit;
display: inline-flex;
position: relative;
-webkit-box-align: center;
align-items: center;
-webkit-box-pack: center;
justify-content: center;
vertical-align: middle;
overflow: hidden;
text-decoration: none;
white-space: nowrap;
user-select: none;
border-top-right-radius: 0.6rem;
border-bottom-right-radius: 0.6rem;
width:2.5rem;
opacity: 0.5;
background-color: white;
cursor: pointer;
@media (max-width: 800px) {
  &{
    border-radius:0.3rem;
  }
}
`;

const Container = styled.div`
margin: 0;
padding: 0;
border: 0;
font-size: 100%;  
font: inherit;
vertical-align: baseline;
display:flex;
flex:1;
justify-content: center;
height: 2.5rem;
@media (max-width: 800px) {
  &{
    justify-content: flex-end;
    padding: 0 0.3rem;
  }
}
`;

function SearchBox({ }) {

  return <Container>
    <SearchInput placeholder="Search" />
    <SearchButton>
      <svg width="100%" height="100%" version="1.1" viewBox="0 0 20 20" x="0px" y="0px" className="ScIconSVG-sc-1bgeryd-1 cMQeyU"><g><path fill-rule="evenodd" d="M13.192 14.606a7 7 0 111.414-1.414l3.101 3.1-1.414 1.415-3.1-3.1zM14 9A5 5 0 114 9a5 5 0 0110 0z" clip-rule="evenodd"></path></g></svg>
    </SearchButton>
  </Container>

}