module Ace where

import Ace.Types
import Data.Foreign.OOFFI
import Control.Monad.Eff
import DOM

foreign import ace :: Ace

createEditSession :: forall e. TextMode -> Document -> Eff (aced :: Aced | e) Document
createEditSession = flip $ method2Eff "createEditSession" ace

edit :: forall e a. Node -> Eff (aced :: Aced, dom :: DOM | e) a
edit = method1Eff "edit" ace
