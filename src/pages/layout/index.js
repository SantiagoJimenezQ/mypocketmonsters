import React, { lazy, Suspense } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { URL } from 'utilities/constants';
import { ChakraProvider } from '@chakra-ui/react';
import Header from 'pages/pokemon/components/header';
import { PokeThemeProvider } from 'utilities/theme';
import { MobileNav, MobileNavButton, PokeMainContainer, PokeMainContentContainer } from 'utilities/styledComponent';
import { PokeProvider } from 'utilities/context';
import { useToast } from "@chakra-ui/react"

// import components
const PokemonList = lazy(() => import("../pokemon"));
const PokemonDetails = lazy(() => import("../pokemon/details"));
const TrainerInfo = lazy(() => import("../trainer"));

const NotFound = () => (
    <p>Not Found</p>
);

const MainLayout = () => {
  const history = useHistory();
  const toast = useToast();

  const clickMenu = (path) => {
    history.push(path);
  }

  const probability = { 50 : 50 };

  const randomTry = () => {
    const random = Math.floor(Math.random() * 100);

    for(const prob in probability) {
      if(prob >= random) {
          toast({
            position: "top",
            duration: 2000,
            render: () => (
              <p>
                Gotcha...
              </p>
            ),
          })
      } else {
        toast({
          position: "top",
          duration: 2000,
          render: () => (
            <p>
              Opps try again
            </p>
          ),
        })
      }
    }
  }

  return (
    <PokeProvider injectValue={{randomTry}}>
      <ChakraProvider theme={PokeThemeProvider}>
      <PokeMainContainer>
          <Header isHidden={history.location.pathname !== URL.POKEMON_LIST} />

          <PokeMainContentContainer>
            <Suspense fallback={<span>Loading items...</span>}>
                <Switch>
                    <Route path={URL.POKEMON_LIST} component={PokemonList} exact />
                    <Route path={URL.POKEMON_DETAILS} component={PokemonDetails} />
                    <Route path={URL.TRAINER_INFO} component={TrainerInfo} />

                    <Route component={NotFound} />
                </Switch>
            </Suspense>   
          </PokeMainContentContainer>

          <MobileNav>
              <MobileNavButton onClick={() => clickMenu(URL.POKEMON_LIST)}>Home</MobileNavButton>
              <MobileNavButton hidden={history.location.pathname === (URL.POKEMON_LIST || URL.TRAINER_INFO)} onClick={() => randomTry()}>Catch</MobileNavButton>
              <MobileNavButton onClick={() => clickMenu(URL.TRAINER_INFO)}>MyList</MobileNavButton>
          </MobileNav>
        </PokeMainContainer>
      </ChakraProvider>
    </PokeProvider>
  );
}

export default MainLayout;
