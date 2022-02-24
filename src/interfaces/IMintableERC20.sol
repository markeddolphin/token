// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.4;

import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
interface IMintableERC20 is IERC20Metadata {
  function mint(address _recipient, uint256 _amount) external;
  function burnFrom(address account, uint256 amount) external;
  function lowerHasMinted(uint256 amount)external;
}
