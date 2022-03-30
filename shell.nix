{ pkgs ? import <nixpkgs> {}}:
# Uncomment the following lines and comment the line above to pin to a specific nixpkgs version
# { pkgs ? import (builtins.fetchTarball {
#   url = "https://github.com/nixos/nixpkgs/archive/a7ecde854aee5c4c7cd6177f54a99d2c1ff28a31.tar.gz";
#   sha256 = "0n2xxk9pzwlbia80xxw03zcxd1qac89vn4mphx5l63r7vd71m54k";
# }) {}}:

let
  nodeVersion = "16";

  nodejs = pkgs."nodejs-${nodeVersion}_x";

  yarn-node = pkgs.yarn.overrideAttrs (oldAttrs: {
    buildInputs = [
      nodejs
    ];
  });
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    yarn-node
    nodejs
  ];

  shellHook = ''
  '';
}