const path = require('node:path');

const workspaceRoot = __dirname;

const resolveWorkspaceModule = (moduleName) =>
  require.resolve(moduleName, {
    paths: [workspaceRoot, path.resolve(workspaceRoot, '..')],
  });

module.exports = {
  '^react$': resolveWorkspaceModule('react'),
  '^react/jsx-runtime$': resolveWorkspaceModule('react/jsx-runtime'),
  '^react/jsx-dev-runtime$': resolveWorkspaceModule('react/jsx-dev-runtime'),
  '^react-dom$': resolveWorkspaceModule('react-dom'),
  '^react-dom/client$': resolveWorkspaceModule('react-dom/client'),
  '^react-dom/test-utils$': resolveWorkspaceModule('react-dom/test-utils'),
};
