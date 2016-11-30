export default function (server) {
  server.loadFixtures()
  server.createList('node', 5)
  server.createList('resource', 5)
}
