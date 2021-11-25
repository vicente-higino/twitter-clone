import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { StateContext } from "../App";
import { ReactComponent as SearchIcon } from "../assets/searchIcon.svg";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { disableScroll, enableScroll } from "../utils";
import styled from "styled-components";

export function NavBar() {
  const { state } = useContext(StateContext);
  return (
    <Nav>
      {state.isLoggedin && (
        <>
          <FlexConteiner>
            <NavLinkStyled exact to="/home">
              Home
            </NavLinkStyled>
            <NavLinkStyled
              exact
              to={`/profile/${state.profile?.username}`}
            >{`@${state.profile?.username}`}</NavLinkStyled>
          </FlexConteiner>
          <SearchBox showInput={false} buttonRound />
          <div>
            <LogoutButton />
          </div>
        </>
      )}
      {!state.isLoggedin && (
        <FlexConteiner>
          <NavLinkStyled to="/login">Login</NavLinkStyled>
          <NavLinkStyled to="/signup">Sign Up</NavLinkStyled>
        </FlexConteiner>
      )}
    </Nav>
  );
}

const FlexConteiner = styled.div`
  display: flex;
`;
const NavLinkStyled = styled(NavLink)`
  display: block;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;

  &:hover {
    background-color: #111111;
  }

  &.active {
    border-bottom: solid 5px orange;
  }
`;

const Nav = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333333;
  position: sticky;
  top: 0;
  z-index: 10;
  @media (max-width: 800px) {
    grid-template-columns: auto 1fr auto;
  }
`;

const SearchInput = styled.input<{ showInput?: boolean }>`
  text-size-adjust: 100%;
  margin: 0;
  box-sizing: border-box;
  border-radius: 0.6rem 0px 0px 0.6rem !important;
  padding: 0.5rem !important;
  font-size: 1rem !important;
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
  width: 20rem;
  @media (max-width: 800px) {
    & {
      display: ${(props) => (props.showInput ? "block" : "none")};
      flex-grow: 1;
    }
  }
`;

const SearchButton = styled.button<{ round?: boolean }>`
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
  width: 2.5rem;
  opacity: 0.5;
  background-color: white;
  cursor: pointer;
  @media (max-width: 800px) {
    & {
      border-radius: ${(props) => (props.round ? "0.3rem" : "none")};
      flex-shrink: 0;
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
  display: flex;
  flex: 1;
  justify-content: center;
  height: 2rem;
  align-self: center;
  @media (max-width: 800px) {
    & {
      justify-content: flex-end;
      padding: 0 0.3rem;
    }
  }
`;

const SearchPageSection = styled.section`
  position: fixed;
  inset: 0;
  margin: 0;
  background-color: #4c4c4c;
  padding-top: min(20vh, 10rem);
`;

const SearchBox: FC<{
  showInput?: boolean;
  buttonRound?: boolean;
  focus?: boolean;
}> = ({ showInput, buttonRound, focus }) => {
  let history = useHistory();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeout = useRef<number | null>(null);
  const [showMobileSearchPage, setshowMobileSearchPage] = useState(false);
  useEffect(() => {
    if (focus) {
      inputRef.current?.focus();
    }
  }, []);
  const search = () => {
    const searchValue = `/profile/${inputRef?.current?.value}`;
    history.push(searchValue);
  };
  const handleChange: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    timeout.current && clearTimeout(timeout.current);
    if (e.key === "Enter") {
      search();
      setshowMobileSearchPage(false);
      enableScroll();
    } else if (window.innerWidth >= 800) {
      timeout.current = window.setTimeout(() => {
        search();
      }, 500);
    }
  };
  const handleClick = () => {
    if (window.innerWidth < 800) {
      if (inputRef?.current?.value === "") {
        if (showMobileSearchPage) {
          setshowMobileSearchPage(false);
          enableScroll();
        } else {
          setshowMobileSearchPage(true);
          inputRef.current?.focus();
          disableScroll();
        }
      } else {
        search();
        setshowMobileSearchPage(false);
        enableScroll();
      }
    } else {
      if (inputRef?.current && inputRef.current.value.length > 0) {
        search();
      }
    }
  };
  return !showMobileSearchPage ? (
    <Container>
      <SearchInput
        showInput={showInput}
        ref={inputRef}
        onKeyUp={(e) => handleChange(e)}
        placeholder="Search"
        size={1}
      />
      <SearchButton onClick={handleClick} round={buttonRound}>
        <SearchIcon />
      </SearchButton>
    </Container>
  ) : (
    <SearchPageSection>
      <Container>
        <SearchInput
          showInput
          ref={inputRef}
          onKeyUp={(e) => handleChange(e)}
          placeholder="Search"
          size={1}
        />
        <SearchButton onClick={handleClick} round={false}>
          <SearchIcon />
        </SearchButton>
      </Container>
    </SearchPageSection>
  );
};
