<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <body>
        <h2>Employee Information</h2>
        <table border="1">
          <tr bgcolor="#9acd32">
            <th>Name</th>
            <th>Position</th>
            <th>Department</th>
          </tr>
          <xsl:for-each select="employees/employee">
            <tr>
              <td><xsl:value-of select="name"/></td>
              <td><xsl:value-of select="position"/></td>
              <td><xsl:value-of select="department"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>