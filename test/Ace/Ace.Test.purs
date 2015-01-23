module Ace.Test where

import Test.Mocha
import Test.Chai

import Ace.Types
import Ace

createEditSessionTest = expect true `toEqual` true

main = describe "Ace" do
  it "Ace.createEditSession" createEditSessionTest
