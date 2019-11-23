pragma solidity >=0.5.0;

contract ReverseRegistrarMock {
  event Claimed( address owner, address resolver );
  event Named( bytes32 node, string name );

  mapping( bytes32 => string ) public name;

  function claim( address _owner ) external returns (bytes32 node) {
    emit Claimed( _owner, address(0x0) );
    return bytes32(0x0);
  }

  function claimWithResolver( address _owner, address _resolver ) external
  returns (bytes32 node) {
    emit Claimed( _owner, _resolver );
    return bytes32(0x0);
  }

  function setName( bytes32 _node, string memory _name ) public {
    name[_node] = _name;
    emit Named( _node, _name );
  }

}

