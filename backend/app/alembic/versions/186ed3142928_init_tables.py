"""Init tables

Revision ID: 186ed3142928
Revises: cd6680ec31ae
Create Date: 2024-11-04 12:40:19.311123

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '186ed3142928'
down_revision = 'cd6680ec31ae'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('projects', 'model',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('projects', 'model',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###
