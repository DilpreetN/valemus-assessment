{
  description = "Frontend dev environment";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_24
          pkgs.pnpm
          pkgs.biome
        ];

        shellHook = ''
          echo "🚀Dev Environment Loaded"
          echo "- Node.js:    $(node -v 2>/dev/null || echo 'not installed')"
          echo "- pnpm:        $(pnpm -v 2>/dev/null || echo 'not installed')"
          echo "- biome:        $(biome -V 2>/dev/null || echo 'not installed')"
        '';
      };
    };
}
