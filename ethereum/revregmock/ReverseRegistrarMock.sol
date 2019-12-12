pragma solidity >=0.5.0;

contract ReverseResolver {
  mapping( bytes32 => string ) public name;

  function setName( bytes32 _node, string calldata _name ) external {
    name[_node] = _name;
  }
}

contract ReverseRegistrarMock {
  event Claimed( address owner, address resolver );
  event Named( bytes32 node, string name );

  ReverseResolver public defaultResolver;

  function claim( address _owner ) public returns (bytes32 node) {
    emit Claimed( _owner, address(0x0) );
    return bytes32(0x0);
  }

  function claimWithResolver( address _owner, address _resolver ) public
  returns (bytes32 node) {
    emit Claimed( _owner, _resolver );
    return bytes32(0x0);
  }

  function setName( string memory _name ) public returns (bytes32) {
    bytes32 node = claimWithResolver( address(this), address(defaultResolver) );
    defaultResolver.setName( node, _name );
    emit Named( node, _name );
    return node;
  }

  constructor() public {
    defaultResolver = new ReverseResolver();
  }
}

