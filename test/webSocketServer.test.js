/* eslint-disable no-unused-expressions */
import WebSocketServer from '../socket/WebSocketServer';

describe('WebSocketServer', () => {
  describe('.register(req, res, next)', () => {
    it('successfully registered, status 200', async () => {
      const resSend = { send: sinon.stub() };
      const req = {
        body: {
          username: 'username',
          email: 'email',
          hashedPassword: 'hashedPassword',
        },
      };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const saveUser = sinon.stub(UserModel, 'save').resolves();
      await register(req, res, next);
      expect(saveUser).to.be.calledWith({
        username: req.body.username,
        email: req.body.email,
        rehashedPassword: req.body.hashedPassword,
      });
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledWith({ payload: { message: 'Successfully registered' } });
      saveUser.restore(UserModel);
    });
    it('unsucessfully registered, cannot save', async () => {
      const resSend = { send: sinon.stub() };
      const req = {
        body: {
          username: 'username',
          email: 'email',
          rehashedPassword: 'rehashedPassword',
        },
      };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const saveUser = sinon.stub(UserModel, 'save').rejects();
      await register(req, res, next);
      expect(saveUser).to.be.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      saveUser.restore(UserModel);
    });
  });
  describe('.logIn(req, res, next)', () => {
    it('successfully logged in, status 200', async () => {
      const resSend = { send: sinon.stub() };
      const req = {
        body: {
          hashedPassword: 'hashedPassword',
          email: 'email',
        },
      };
      const user = {
        username: 'username',
        rehashedPassword: 'rehashedPassword',
      };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByEmail = sinon.stub(UserModel, 'getUserByEmail').resolves(user);
      const comparePassword = sinon.stub(UserModel, 'comparePassword').resolves(true);
      await logIn(req, res, next);
      expect(getUserByEmail).to.be.calledWith(req.body.email);
      expect(comparePassword).to.be.calledWith({
        userPassword: req.body.hashedPassword,
        rehashedPassword: user.rehashedPassword,
      });
      expect(res.status).to.be.calledWith(200);
      expect(resSend.send).to.be.calledOnce;
      expect(next).to.be.not.calledOnce;
      getUserByEmail.restore(UserModel);
      comparePassword.restore(UserModel);
    });
    it('unsuccessfully logged in, email is wrong', async () => {
      const resSend = { send: sinon.stub() };
      const req = {
        body: {
          hashedPassword: 'username',
          email: 'email',
        },
      };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByEmail = sinon.stub(UserModel, 'getUserByEmail').resolves(undefined);
      await logIn(req, res, next);
      expect(getUserByEmail).to.be.calledWith(req.body.email);
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      getUserByEmail.restore(UserModel);
    });
    it('unsuccessfully logged in, password is wrong', async () => {
      const resSend = { send: sinon.stub() };
      const req = {
        body: {
          hashedPassword: 'hashedPassword',
          email: 'email',
        },
      };
      const user = {
        username: 'username',
        rehashedPassword: 'rehashedPassword',
      };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByEmail = sinon.stub(UserModel, 'getUserByEmail').resolves(user);
      const comparePassword = sinon.stub(UserModel, 'comparePassword').resolves(false);
      await logIn(req, res, next);
      expect(getUserByEmail).to.be.calledWith(req.body.email);
      expect(comparePassword).to.be.calledWith({
        userPassword: req.body.hashedPassword,
        rehashedPassword: user.rehashedPassword,
      });
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      getUserByEmail.restore(UserModel);
      comparePassword.restore(UserModel);
    });
    it('unsuccessfully logged in, UserModel rejects', async () => {
      const resSend = { send: sinon.stub() };
      const req = {
        body: {
          hashedPassword: 'hashedPassword',
          email: 'email',
        },
      };
      const res = { status: sinon.stub().returns(resSend) };
      const next = sinon.stub();
      const getUserByEmail = sinon.stub(UserModel, 'getUserByEmail').rejects();
      const comparePassword = sinon.stub(UserModel, 'comparePassword').resolves();
      await logIn(req, res, next);
      expect(getUserByEmail).to.be.calledWith(req.body.email);
      expect(comparePassword).to.be.not.calledOnce;
      expect(res.status).to.be.not.calledOnce;
      expect(resSend.send).to.be.not.calledOnce;
      expect(next).to.be.calledOnce;
      expect(next.args[0][0]).to.be.instanceOf(AppError);
      getUserByEmail.restore(UserModel);
      comparePassword.restore(UserModel);
    });
  });
});
