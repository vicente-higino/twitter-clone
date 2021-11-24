import React, { FC, useContext, useEffect, useRef } from "react";
import { LogoutButton } from "./LogoutButton";
import { StateContext } from "../App";
import { ReactComponent as SearchIcon } from "../assets/searchIcon.svg";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

export function NavBar() {
  const { state } = useContext(StateContext);
  return (
    <Nav>
      {state.isLoggedin && (
        <>
          <NavLink exact to="/home">
            Home
          </NavLink>
          <NavLink
            exact
            to={`/profile/${state.profile?.username}`}
          >{`@${state.profile?.username}`}</NavLink>
          <SearchBox showInput={false} buttonRound />
          <LogoutButton />
        </>
      )}
      {!state.isLoggedin && (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input<{ showInput?: boolean }>`
  text-size-adjust: 100%;
  margin: 0;
  size: 1;
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
  @media (max-width: 800px) {
    & {
      justify-content: flex-end;
      padding: 0 0.3rem;
    }
  }
`;

const SearchBox: FC<{
  showInput?: boolean;
  buttonRound?: boolean;
  focus?: boolean;
}> = ({ showInput, buttonRound, focus }) => {
  let history = useHistory();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeout = useRef<number | null>(null);
  const location = useLocation();
  useEffect(() => {
    if (focus) {
      inputRef.current?.focus();
    }
  }, []);
  const search = () => {
    const inputValue = inputRef?.current?.value;
    if (inputValue && inputValue.length > 0) {
      const searchValue = `/profile/${inputValue}`;
      history.push(searchValue);
    }
  };
  const handleChange: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    timeout.current && clearTimeout(timeout.current);
    if (e.key === "Enter") {
      search();
    } else if (window.innerWidth >= 800) {
      timeout.current = window.setTimeout(() => {
        search();
      }, 500);
    }
  };
  const handleClick = () => {
    if (window.innerWidth < 800 && location.pathname !== "/search") {
      history.push("/search");
    } else {
      search();
    }
  };
  return (
    <Container>
      <SearchInput
        showInput={showInput}
        ref={inputRef}
        onKeyUp={(e) => handleChange(e)}
        placeholder="Search"
      />
      <SearchButton onClick={handleClick} round={buttonRound}>
        <SearchIcon />
      </SearchButton>
    </Container>
  );
};

export function SearchPage({}) {
  return (
    <section>
      <SearchBox focus showInput buttonRound={false} />
    </section>
  );
}
