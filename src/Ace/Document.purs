module Ace.Document where

import Ace.Types
import Data.Foreign.OOFFI
import Control.Monad.Eff
import Control.Monad.Cont.Trans

newDocument :: forall e. Eff (aced :: Aced | e) Document
newDocument = instantiate0 "Document"
